import { useState } from "react";
import "./App.css";
import { attack } from "./examples/afterglow/afterglow";
import { getAfterglowGraph } from "./examples/afterglow/afterglow.graph";
import { Form } from "./Form";
import { Line } from "./Line";

function App() {
  const [value, setValue] = useState({
    attackDices: 3,
    defenceThreshold: 7,
    weaponDamage: 4,
    headArmour: 6,
    bodyArmour: 9,
    tryAimForHead: true,
  });

  const afterglowGraph = getAfterglowGraph();

  afterglowGraph.addDataset("current", attack(value));

  return (
    <div className="App">
      <Form
        schema={{
          attackDices: "number",
          defenceThreshold: "number",
          weaponDamage: "number",
          headArmour: "number",
          bodyArmour: "number",
          tryAimForHead: "boolean",
        }}
        value={value}
        onChange={setValue}
      />
      <Line data={afterglowGraph.regularGraph()} />
      <Line data={afterglowGraph.sumGraph()} />
    </div>
  );
}

export default App;
