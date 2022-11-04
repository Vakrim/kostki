import Benchmark from "benchmark";
import { d12 } from "../src/diceFactories";
import { combine } from "../src/index";

const suite = new Benchmark.Suite();

const dice = d12();

suite
  .add("combine", function () {
    combine(dice, dice, (a, b) => a + b);
  })
  // @ts-expect-error
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", function () {
    // @ts-expect-error
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  .run({ async: true });
