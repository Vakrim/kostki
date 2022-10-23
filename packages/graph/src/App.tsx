import "./App.css";
import { attack } from "./examples/afterglow/afterglow";
import { getAfterglowGraph } from "./examples/afterglow/afterglow.graph";
import { Form } from "./Form";
import { Line } from "./Line";
import { useDatasets } from "./useDatasets";

function App() {
  const {
    datasets,
    schema,
    addDataset,
    updateDatasetValues,
    updateDatasetName,
    deleteDataset,
  } = useDatasets(
    {
      attackDices: "number",
      defenceThreshold: "number",
      weaponDamage: "number",
      headArmour: "number",
      bodyArmour: "number",
      tryAimForHead: "boolean",
    },
    [
      {
        name: "aiming for head",
        values: {
          attackDices: 3,
          defenceThreshold: 7,
          weaponDamage: 4,
          headArmour: 6,
          bodyArmour: 9,
          tryAimForHead: true,
        },
      },
      {
        name: "body shot",
        values: {
          attackDices: 3,
          defenceThreshold: 7,
          weaponDamage: 4,
          headArmour: 6,
          bodyArmour: 9,
          tryAimForHead: false,
        },
      },
    ],
    () => ({
      attackDices: 3,
      defenceThreshold: 7,
      weaponDamage: 4,
      headArmour: 6,
      bodyArmour: 9,
      tryAimForHead: false,
    })
  );

  const afterglowGraph = getAfterglowGraph();

  datasets.forEach((dataset) => {
    afterglowGraph.addDataset(dataset.id.toString(), attack(dataset.values));
  });

  return (
    <div className="App">
      {datasets.map((dataset) => (
        <div key={dataset.id}>
          <Form
            schema={schema}
            values={dataset.values}
            changeValues={(values) => {
              updateDatasetValues(dataset.id, values);
            }}
            name={dataset.name}
            changeName={(name) => {
              updateDatasetName(dataset.id, name);
            }}
            deleteDataset={() => deleteDataset(dataset.id)}
          />
        </div>
      ))}
      <button onClick={addDataset}>Add</button>
      <Line data={afterglowGraph.regularGraph()} />
      <Line data={afterglowGraph.sumGraph()} />
    </div>
  );
}

export default App;
