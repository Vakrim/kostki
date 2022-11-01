import { combine, Dice, map, reduceWithN, simplify } from "kostki";

export function registerSprite({
  resonance,
  compiling,
  registering,
  spriteLevel,
  fadingResistance,
  expectedNumberOfTasks,
  stunRecovery,
  hoursOfOperation,
}: {
  resonance: number;
  compiling: number;
  registering: number;
  spriteLevel: number;
  fadingResistance: number;
  expectedNumberOfTasks: number;
  stunRecovery: number;
  hoursOfOperation: number;
}) {
  const compilingTest = applyLimit(test(resonance + compiling), spriteLevel);

  const registeringTest = applyLimit(
    test(resonance + registering),
    spriteLevel
  );

  const spriteCompilationResistanceTest = test(spriteLevel);

  const spriteRegistrationResistanceTest = test(spriteLevel * 2);

  // const tasks = subtractNatural(compilingHits, spriteResistanceHits);

  let state = Dice.always<State>({
    hoursPassed: 0,
    stunDamage: 0,
    compiledSprite: null,
    registered: [],
  });

  const fadingResistanceTest = test(fadingResistance);

  for (let tries = 0; tries < 5; tries++) {
    state = compile({
      state,
      compilingTest,
      spriteResistanceTest: spriteCompilationResistanceTest,
      fadingResistanceTest,
      hoursOfOperation,
    });

    state = recover({ state, hoursOfOperation, stunRecovery });
  }

  state = register({
    state,
    registeringTest,
    spriteRegistrationResistanceTest,
    fadingResistanceTest,
    spriteLevel,
    hoursOfOperation,
  });

  return simplify(state).map(({ hoursPassed, ...x }) => ({ ...x }));
}

export interface Result {
  stunDamage: number;
  compiledSprite: { tasks: number } | null;
  registered: { tasks: number }[];
}

export interface State {
  hoursPassed: number;
  stunDamage: number;
  compiledSprite: { tasks: number } | null;
  registered: { tasks: number }[];
}

const shadowrunDice = new Dice([
  [1, 1],
  [0, 2],
]);

const test = reduceWithN(shadowrunDice, (a, b) => a + b);

function register({
  state,
  registeringTest,
  spriteRegistrationResistanceTest,
  fadingResistanceTest,
  spriteLevel,
  hoursOfOperation,
}: {
  state: Dice<State>;
  registeringTest: Dice<number>;
  spriteRegistrationResistanceTest: Dice<number>;
  fadingResistanceTest: Dice<number>;
  spriteLevel: number;
  hoursOfOperation: number;
}) {
  state = combine(
    state,
    registeringTest,
    spriteRegistrationResistanceTest,
    fadingResistanceTest,
    (s, registeringHits, spriteHits, fadingResistanceHits) => {
      if (!shouldRegister(s, spriteLevel, hoursOfOperation)) {
        return s;
      }

      const damage = Math.max(
        0,
        Math.max(spriteHits * 2, 2) - fadingResistanceHits
      );

      const netHits = registeringHits - spriteHits;

      return {
        compiledSprite: netHits >= 0 ? null : s.compiledSprite,
        hoursPassed: s.hoursPassed + spriteLevel,
        stunDamage: s.stunDamage + damage,
        registered:
          netHits >= 0
            ? [...s.registered, { tasks: s.compiledSprite!.tasks + netHits }]
            : s.registered,
      };
    }
  );
  return state;
}

function compile({
  state,
  compilingTest,
  spriteResistanceTest,
  fadingResistanceTest,
}: {
  state: Dice<State>;
  compilingTest: Dice<number>;
  spriteResistanceTest: Dice<number>;
  fadingResistanceTest: Dice<number>;
  hoursOfOperation: number;
}) {
  for (
    let tries = 0;
    tries < 5 && state.pairs.some(([s]) => shouldCompile(s));
    tries++
  ) {
    state = combine(
      state,
      compilingTest,
      spriteResistanceTest,
      fadingResistanceTest,
      (s, compilingHits, spriteHits, fadingResistanceHits): State => {
        if (!shouldCompile(s)) {
          return s;
        }

        const damage = Math.max(
          0,
          Math.max(spriteHits * 2, 2) - fadingResistanceHits
        );

        const tasks = Math.max(0, compilingHits - spriteHits);

        return {
          ...s,
          compiledSprite: tasks > 0 ? { tasks } : null,
          stunDamage: s.stunDamage + damage,
        };
      }
    );
  }
  return state;
}

function applyLimit(dice: Dice<number>, limit: number) {
  return map(dice, (d) => Math.min(d, limit));
}

function recover({
  state,
  hoursOfOperation,
  stunRecovery,
}: {
  state: Dice<State>;
  hoursOfOperation: number;
  stunRecovery: number;
}) {
  for (
    let tries = 0;
    tries < 5 && state.pairs.some(([s]) => shouldRecover(s, hoursOfOperation));
    tries++
  ) {
    state = combine(state, test(stunRecovery), (s, recovery): State => {
      if (!shouldRecover(s, hoursOfOperation)) {
        return s;
      }

      return {
        ...s,
        hoursPassed: s.hoursPassed + 1,
        stunDamage: Math.max(0, s.stunDamage - recovery),
      };
    });
  }
  return state;
}

function shouldRecover(s: State, hoursOfOperation: number) {
  return s.stunDamage > 0 && s.hoursPassed + 1 <= hoursOfOperation;
}

function shouldCompile(s: State) {
  return s.compiledSprite === null && s.stunDamage === 0;
}

function shouldRegister(
  s: State,
  spriteLevel: number,
  hoursOfOperation: number
) {
  return s.compiledSprite && s.hoursPassed + spriteLevel <= hoursOfOperation;
}
