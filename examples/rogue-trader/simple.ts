import { d10 } from "../../src/diceFactories";
import { sum } from "../../src/helpers";
import { Dice  } from "../../src/Dice";
import { rollTest, FAIL, enemy } from "./rogue-trader";

interface Weapon {
  damageBase: number;
  aimedBonus: number;
  penetration: number;
  rateOfFire: number;
  maxAimedHits: number;
}

const ArcheotechLaspistol: Weapon = {
  damageBase: 3,
  aimedBonus: 10,
  penetration: 2,
  rateOfFire: 3,
  maxAimedHits: Infinity,
};

const PlasmaPistol: Weapon = {
  damageBase: 6,
  aimedBonus: 0,
  penetration: 6,
  rateOfFire: 2,
  maxAimedHits: 1,
};

const aimBonus = 10,
  semiAutoBonus = 10;

const WS = 45;

const damage = enemy(0);

const simple = rollTest(WS).mapTo(result => {
  if (result.type === FAIL) {
    return Dice.always(damage(0, 0));
  }

  return d10().map(v =>
    damage(v + ArcheotechLaspistol.damageBase, ArcheotechLaspistol.penetration)
  );
});

function renderResult(label: string, dice: Dice<number>) {
  console.log(label);
  const pairs = dice.pairs;
  const avarage = pairs.reduce(
    (sum, [value, probability]) => sum + value * probability,
    0
  );
  console.log(`average: ${avarage}`);
  console.log(``);
}

renderResult("simple", simple);

function aimed(gun: Weapon, modificator: number = 0) {
  return rollTest(WS + aimBonus + gun.aimedBonus).mapTo(
    result => {
      if (result.type === FAIL) {
        return Dice.always(damage(0, 0));
      }

      const hits = Math.min(1 + Math.floor(result.DoS / 2), gun.maxAimedHits);

      const hitRolls = Array.from({ length: hits }, () =>
        d10().map(dmg =>
          damage(
            dmg + gun.damageBase,
            gun.penetration
          )
        )
      );

      return sum(hitRolls);
    }
  );
}

const aimedLaspistol = aimed(ArcheotechLaspistol);

renderResult("aimed: Laspistol", aimedLaspistol);

const aimedPlasma = aimed(PlasmaPistol);

renderResult("aimed: Plasma", aimedPlasma);

function semiAuto(gun: Weapon, modificator: number = 0) {
  return rollTest(WS + semiAutoBonus + modificator).mapTo(result => {
    if (result.type === FAIL) {
      return Dice.always(damage(0, 0));
    }

    const hits = Math.min(1 + Math.floor(result.DoS / 2), gun.rateOfFire);

    const hitRolls = Array.from({ length: hits }, () =>
      d10().map(dmg => damage(dmg + gun.damageBase, gun.penetration))
    );

    return sum(hitRolls);
  });
}

const semiAutoLaspistol = semiAuto(ArcheotechLaspistol);

renderResult("semiAuto: Laspistol", semiAutoLaspistol);

const semiAutoPlasmaPistol = semiAuto(PlasmaPistol);

renderResult("semiAuto: PlasmaPistol", semiAutoPlasmaPistol);

const semiAutoLaspistolAndPlasma = sum([
  semiAuto(ArcheotechLaspistol, -20),
  semiAuto(PlasmaPistol, -20)
]);

renderResult("semiAuto: Laspistol and Plasma", semiAutoLaspistolAndPlasma);

const semiAutoPlasmaAndLaspistol = sum([
  semiAuto(PlasmaPistol, -20),
  semiAuto(ArcheotechLaspistol, -20)
]);

renderResult("semiAuto: Plasma And Laspistol", semiAutoPlasmaAndLaspistol);
