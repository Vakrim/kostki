import { Dice } from "../Dice";
import { ProbabilityMap } from "../ProbabilityMap";

export function combine<R, G1, G2, G3, G4, G5, G6>(
  ...args: Arguments<R, G1, G2, G3, G4, G5, G6>
): Dice<R> {
  if (args.length === 3) {
    return combine2(...args);
  } else if (args.length === 4) {
    return combine3(...args);
  } else if (args.length === 5) {
    return combine4(...args);
  } else if (args.length === 6) {
    return combine5(...args);
  } else if (args.length === 7) {
    return combine6(...args);
  }
  throw new TypeError("unexpected number of arguments in combine");
}

function combine2<R, G1, G2>(
  dice1: Dice<G1>,
  dice2: Dice<G2>,
  combiner: (d1: G1, g2: G2) => R
) {
  const result = new ProbabilityMap<R>((increase) => {
    for (const p1 of dice1.pairs) {
      for (const p2 of dice2.pairs) {
        increase(combiner(p1[0], p2[0]), p1[1] * p2[1]);
      }
    }
  });

  return new Dice(result);
}

function combine3<R, G1, G2, G3>(
  dice1: Dice<G1>,
  dice2: Dice<G2>,
  dice3: Dice<G3>,
  combiner: (d1: G1, g2: G2, g3: G3) => R
) {
  const result = new ProbabilityMap<R>((increase) => {
    for (const p1 of dice1.pairs) {
      for (const p2 of dice2.pairs) {
        for (const p3 of dice3.pairs) {
          increase(combiner(p1[0], p2[0], p3[0]), p1[1] * p2[1] * p3[1]);
        }
      }
    }
  });

  return new Dice(result);
}

function combine4<R, G1, G2, G3, G4>(
  dice1: Dice<G1>,
  dice2: Dice<G2>,
  dice3: Dice<G3>,
  dice4: Dice<G4>,
  combiner: (d1: G1, g2: G2, g3: G3, g4: G4) => R
) {
  const result = new ProbabilityMap<R>((increase) => {
    for (const p1 of dice1.pairs) {
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
    }
  });

  return new Dice(result);
}

function combine5<R, G1, G2, G3, G4, G5>(
  dice1: Dice<G1>,
  dice2: Dice<G2>,
  dice3: Dice<G3>,
  dice4: Dice<G4>,
  dice5: Dice<G5>,
  combiner: (d1: G1, g2: G2, g3: G3, g4: G4, g5: G5) => R
) {
  const result = new ProbabilityMap<R>((increase) => {
    for (const p1 of dice1.pairs) {
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
    }
  });

  return new Dice(result);
}

function combine6<R, G1, G2, G3, G4, G5, G6>(
  dice1: Dice<G1>,
  dice2: Dice<G2>,
  dice3: Dice<G3>,
  dice4: Dice<G4>,
  dice5: Dice<G5>,
  dice6: Dice<G6>,
  combiner: (d1: G1, g2: G2, g3: G3, g4: G4, g5: G5, g6: G6) => R
) {
  const result = new ProbabilityMap<R>((increase) => {
    for (const p1 of dice1.pairs) {
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
    }
  });

  return new Dice(result);
}

type Arguments<R, G1, G2, G3, G4, G5, G6> =
  | [dice1: Dice<G1>, dice2: Dice<G2>, combiner: (d1: G1, g2: G2) => R]
  | [
      dice1: Dice<G1>,
      dice2: Dice<G2>,
      dice3: Dice<G3>,
      combiner: (d1: G1, g2: G2, g3: G3) => R
    ]
  | [
      dice1: Dice<G1>,
      dice2: Dice<G2>,
      dice3: Dice<G3>,
      dice4: Dice<G4>,
      combiner: (d1: G1, g2: G2, g3: G3, g4: G4) => R
    ]
  | [
      dice1: Dice<G1>,
      dice2: Dice<G2>,
      dice3: Dice<G3>,
      dice4: Dice<G4>,
      dice5: Dice<G5>,
      combiner: (d1: G1, g2: G2, g3: G3, g4: G4, g5: G5) => R
    ]
  | [
      dice1: Dice<G1>,
      dice2: Dice<G2>,
      dice3: Dice<G3>,
      dice4: Dice<G4>,
      dice5: Dice<G5>,
      dice6: Dice<G6>,
      combiner: (d1: G1, g2: G2, g3: G3, g4: G4, g5: G5, g6: G6) => R
    ];
