import { sum } from "../../src/helpers";
import {
  aimedShoot,
  ArcheotechLaspistol,
  getResult,
  PlasmaPistol,
  semiAuto,
  simpleShoot,
} from "./guns-and-shooting";

describe("rogue trader", () => {
  it("simple shoot", () => {
    expect(getResult(simpleShoot).average).toBeCloseTo(3.824);
  });

  it("aimed Laspistol", () => {
    const aimedLaspistol = aimedShoot(ArcheotechLaspistol);

    expect(getResult(aimedLaspistol).average).toBeCloseTo(11.9);
  });

  it("aimed Plasma", () => {
    const aimedPlasma = aimedShoot(PlasmaPistol);

    expect(getResult(aimedPlasma).average).toBeCloseTo(6.325);
  });

  it("semiAuto: Laspistol", () => {
    const semiAutoLaspistol = semiAuto(ArcheotechLaspistol);

    expect(getResult(semiAutoLaspistol).average).toBeCloseTo(8.925);
  });

  it("semiAuto: PlasmaPistol", () => {
    const semiAutoPlasmaPistol = semiAuto(PlasmaPistol);

    expect(getResult(semiAutoPlasmaPistol).average).toBeCloseTo(10.35);
  });

  it("semiAuto: Laspistol and Plasma", () => {
    const semiAutoLaspistolAndPlasma = sum([
      semiAuto(ArcheotechLaspistol, 0),
      semiAuto(PlasmaPistol, -20),
    ]);

    expect(getResult(semiAutoLaspistolAndPlasma).average).toBeCloseTo(14.675);
  });

  it("semiAuto: Plasma And Laspistol", () => {
    const semiAutoPlasmaAndLaspistol = sum([
      semiAuto(PlasmaPistol, 0),
      semiAuto(ArcheotechLaspistol, -20),
    ]);

    expect(getResult(semiAutoPlasmaAndLaspistol).average).toBeCloseTo(14.6);
  });
});
