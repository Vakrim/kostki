import { d100, d10, roll } from "../src/diceFactories";
import { Dice, sum } from "../src/Dice";
import { rollTest, FAIL, enemy } from "./rogue-trader";

interface Weapon {
  damageBase: number,
  aimedBonus: number,
  penetration: number,
  rateOfFire: number
}

const ArcheotechLaspistol: Weapon = {
  damageBase: 3,
  aimedBonus: 10,
  penetration: 2,
  rateOfFire: 3
};

const PlasmaPistol: Weapon = {
  damageBase: 6,
  aimedBonus: 0,
  penetration: 6,
  rateOfFire: 2
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

const aimed = rollTest(WS + aimBonus + ArcheotechLaspistol.aimedBonus).mapTo(
  result => {
    if (result.type === FAIL) {
      return Dice.always(damage(0, 0));
    }

    const hits = 1 + Math.floor(result.DoS / 2);

    const hitRolls = Array.from({ length: hits }, () =>
      d10().map(dmg =>
        damage(
          dmg + ArcheotechLaspistol.damageBase,
          ArcheotechLaspistol.penetration
        )
      )
    );

    return sum(hitRolls);
  }
);

renderResult("aimed", aimed);

function semiAuto(gun: Weapon, offhandPenalty: number = 0) {
  return rollTest(WS + semiAutoBonus + offhandPenalty).mapTo(result => {
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

const semiAutoLaspistolAndPlasma = sum([semiAuto(ArcheotechLaspistol), semiAuto(PlasmaPistol, -20)]);

renderResult("semiAuto: Laspistol and Plasma", semiAutoLaspistolAndPlasma);

const semiAutoPlasmaAndLaspistol = sum([semiAuto(PlasmaPistol), semiAuto(ArcheotechLaspistol, -20)]);

renderResult("semiAuto: Plasma And Laspistol", semiAutoPlasmaAndLaspistol);