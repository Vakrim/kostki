import { Dice, d10, sum } from "kostki";
import { rollTest, FAIL, enemy } from "./rogueTraderRoll";

interface Weapon {
  damageBase: number;
  aimedBonus: number;
  penetration: number;
  rateOfFire: number;
  maxAimedHits: number;
}

export const ArcheotechLaspistol: Weapon = {
  damageBase: 3,
  aimedBonus: 10,
  penetration: 2,
  rateOfFire: 3,
  maxAimedHits: Infinity,
};

export const PlasmaPistol: Weapon = {
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

export function getResult(dice: Dice<number>) {
  const pairs = dice.pairs;
  const average = pairs.reduce(
    (sum, [value, probability]) => sum + value * probability,
    0
  );
  return { average };
}

export function fire(gun: Weapon, fireType: "simple" | "aimed" | "semiAuto") {
  const modificator =
    fireType === "simple"
      ? 0
      : fireType === "semiAuto"
      ? semiAutoBonus
      : aimBonus + gun.aimedBonus;

  return rollTest(WS + modificator).mapTo((result) => {
    if (result.type === FAIL) {
      return Dice.always(damage(0, 0));
    }

    const hits = Math.min(1 + Math.floor(result.DoS / 2), gun.rateOfFire);

    const hitRolls = Array.from({ length: hits }, () =>
      d10().map((dmg) => damage(dmg + gun.damageBase, gun.penetration))
    );

    return sum(hitRolls);
  });
}

export function fireGun(
  gunName: "ArcheotechLaspistol" | "PlasmaPistol",
  fireType: "simple" | "aimed" | "semiAuto"
) {
  const gun =
    gunName === "ArcheotechLaspistol" ? ArcheotechLaspistol : PlasmaPistol;

  return fire(gun, fireType);
}
