import {
  ArcheotechLaspistol,
  getResult,
  PlasmaPistol,
  fire,
} from "./gunsAndShooting";

describe("rogue trader", () => {
  it("simple shoot", () => {
    expect(getResult(fire(ArcheotechLaspistol, "simple")).average).toBeCloseTo(
      6.375
    );
  });

  it("aimed Laspistol", () => {
    const aimedLaspistol = fire(ArcheotechLaspistol, "aimed");

    expect(getResult(aimedLaspistol).average).toBeCloseTo(11.475);
  });

  it("aimed Plasma", () => {
    const aimedPlasma = fire(PlasmaPistol, "aimed");

    expect(getResult(aimedPlasma).average).toBeCloseTo(10.35);
  });

  it("semiAuto: Laspistol", () => {
    const semiAutoLaspistol = fire(ArcheotechLaspistol, "semiAuto");

    expect(getResult(semiAutoLaspistol).average).toBeCloseTo(8.925);
  });

  it("semiAuto: PlasmaPistol", () => {
    const semiAutoPlasmaPistol = fire(PlasmaPistol, "semiAuto");

    expect(getResult(semiAutoPlasmaPistol).average).toBeCloseTo(10.35);
  });
});
