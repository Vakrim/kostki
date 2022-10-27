import { attack } from "./afterglowRoll";

describe("afterglow", () => {
  it("Try aim for head", () => {
    expect(
      `${attack({
        attackDices: 3,
        defenceThreshold: 7,
        weaponDamage: 4,
        headArmour: 6,
        bodyArmour: 9,
        tryAimForHead: true,
      })}`
    ).toMatchInlineSnapshot(`
      ""no damage" with 43.62%
      "light wound" with 48.07%
      "severe wound" with 8.31%"
    `);
  });

  it("Body shoot", () => {
    expect(
      `${attack({
        attackDices: 3,
        defenceThreshold: 7,
        weaponDamage: 4,
        headArmour: 6,
        bodyArmour: 9,
        tryAimForHead: false,
      })}`
    ).toMatchInlineSnapshot(`
      ""no damage" with 44.69%
      "light wound" with 49.10%
      "severe wound" with 6.21%"
    `);
  });
});
