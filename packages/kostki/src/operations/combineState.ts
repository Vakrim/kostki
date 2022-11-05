import { Dice } from "../Dice";
import { ProbabilityMap } from "../ProbabilityMap";

export function combineState<State, G2, G3, G4, G5, G6>(
  ...args: Arguments<State, G2, G3, G4, G5, G6>
): { state: Dice<State>; some: boolean; every: boolean } {
  if (args.length === 4) {
    return combineState2(...args);
  } else if (args.length === 5) {
    return combineState3(...args);
  } else if (args.length === 6) {
    return combineState4(...args);
  } else if (args.length === 7) {
    return combineState5(...args);
  } else if (args.length === 8) {
    return combineState6(...args);
  }
  throw new TypeError("unexpected number of arguments in combine");
}

function combineState2<State, G2>(
  dice1: Dice<State>,
  dice2: Dice<G2>,
  condition: (value: State) => boolean,
  combiner: (d1: State, g2: G2) => State
) {
  let some = false,
    every = true;

  const result = new ProbabilityMap<State>((increase) => {
    for (const p1 of dice1.pairs) {
      if (condition(p1[0])) {
        some = true;
        for (const p2 of dice2.pairs) {
          increase(combiner(p1[0], p2[0]), p1[1] * p2[1]);
        }
      } else {
        every = false;
        increase(p1[0], p1[1]);
      }
    }
  });

  return { state: new Dice(result), some, every };
}

function combineState3<State, G2, G3>(
  dice1: Dice<State>,
  dice2: Dice<G2>,
  dice3: Dice<G3>,
  condition: (value: State) => boolean,
  combiner: (d1: State, g2: G2, g3: G3) => State
) {
  let some = false,
    every = true;

  const result = new ProbabilityMap<State>((increase) => {
    for (const p1 of dice1.pairs) {
      if (condition(p1[0])) {
        some = true;
        for (const p2 of dice2.pairs) {
          for (const p3 of dice3.pairs) {
            increase(combiner(p1[0], p2[0], p3[0]), p1[1] * p2[1] * p3[1]);
          }
        }
      } else {
        every = false;
        increase(p1[0], p1[1]);
      }
    }
  });

  return { state: new Dice(result), some, every };
}

function combineState4<State, G2, G3, G4>(
  dice1: Dice<State>,
  dice2: Dice<G2>,
  dice3: Dice<G3>,
  dice4: Dice<G4>,
  condition: (value: State) => boolean,
  combiner: (d1: State, g2: G2, g3: G3, g4: G4) => State
) {
  let some = false,
    every = true;

  const result = new ProbabilityMap<State>((increase) => {
    for (const p1 of dice1.pairs) {
      if (condition(p1[0])) {
        some = true;
        for (const p2 of dice2.pairs) {
          for (const p3 of dice3.pairs) {
            for (const p4 of dice4.pairs) {
              increase(
                combiner(p1[0], p2[0], p3[0], p4[0]),
                p1[1] * p2[1] * p3[1] * p4[1]
              );
            }
          }
        }
      } else {
        every = false;
        increase(p1[0], p1[1]);
      }
    }
  });

  return { state: new Dice(result), some, every };
}

function combineState5<State, G2, G3, G4, G5>(
  dice1: Dice<State>,
  dice2: Dice<G2>,
  dice3: Dice<G3>,
  dice4: Dice<G4>,
  dice5: Dice<G5>,
  condition: (value: State) => boolean,
  combiner: (d1: State, g2: G2, g3: G3, g4: G4, g5: G5) => State
) {
  let some = false,
    every = true;

  const result = new ProbabilityMap<State>((increase) => {
    for (const p1 of dice1.pairs) {
      if (condition(p1[0])) {
        some = true;
        for (const p2 of dice2.pairs) {
          for (const p3 of dice3.pairs) {
            for (const p4 of dice4.pairs) {
              for (const p5 of dice5.pairs) {
                increase(
                  combiner(p1[0], p2[0], p3[0], p4[0], p5[0]),
                  p1[1] * p2[1] * p3[1] * p4[1] * p5[1]
                );
              }
            }
          }
        }
      } else {
        every = false;
        increase(p1[0], p1[1]);
      }
    }
  });

  return { state: new Dice(result), some, every };
}

function combineState6<State, G2, G3, G4, G5, G6>(
  dice1: Dice<State>,
  dice2: Dice<G2>,
  dice3: Dice<G3>,
  dice4: Dice<G4>,
  dice5: Dice<G5>,
  dice6: Dice<G6>,
  condition: (value: State) => boolean,
  combiner: (d1: State, g2: G2, g3: G3, g4: G4, g5: G5, g6: G6) => State
) {
  let some = false,
    every = true;

  const result = new ProbabilityMap<State>((increase) => {
    for (const p1 of dice1.pairs) {
      if (condition(p1[0])) {
        some = true;
        for (const p2 of dice2.pairs) {
          for (const p3 of dice3.pairs) {
            for (const p4 of dice4.pairs) {
              for (const p5 of dice5.pairs) {
                for (const p6 of dice6.pairs) {
                  increase(
                    combiner(p1[0], p2[0], p3[0], p4[0], p5[0], p6[0]),
                    p1[1] * p2[1] * p3[1] * p4[1] * p5[1] * p6[1]
                  );
                }
              }
            }
          }
        }
      } else {
        every = false;
        increase(p1[0], p1[1]);
      }
    }
  });

  return { state: new Dice(result), some, every };
}

type Arguments<State, G2, G3, G4, G5, G6> =
  | [
      dice1: Dice<State>,
      dice2: Dice<G2>,
      condition: (d1: State) => boolean,
      combiner: (d1: State, g2: G2) => State
    ]
  | [
      dice1: Dice<State>,
      dice2: Dice<G2>,
      dice3: Dice<G3>,
      condition: (d1: State) => boolean,
      combiner: (d1: State, g2: G2, g3: G3) => State
    ]
  | [
      dice1: Dice<State>,
      dice2: Dice<G2>,
      dice3: Dice<G3>,
      dice4: Dice<G4>,
      condition: (d1: State) => boolean,
      combiner: (d1: State, g2: G2, g3: G3, g4: G4) => State
    ]
  | [
      dice1: Dice<State>,
      dice2: Dice<G2>,
      dice3: Dice<G3>,
      dice4: Dice<G4>,
      dice5: Dice<G5>,
      condition: (d1: State) => boolean,
      combiner: (d1: State, g2: G2, g3: G3, g4: G4, g5: G5) => State
    ]
  | [
      dice1: Dice<State>,
      dice2: Dice<G2>,
      dice3: Dice<G3>,
      dice4: Dice<G4>,
      dice5: Dice<G5>,
      dice6: Dice<G6>,
      condition: (d1: State) => boolean,
      combiner: (d1: State, g2: G2, g3: G3, g4: G4, g5: G5, g6: G6) => State
    ];
