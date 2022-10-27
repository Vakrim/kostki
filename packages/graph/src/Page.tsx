import { Dice } from "kostki";
import "./App.css";
import { Form } from "./Form";
import { Graph } from "./Graph";
import { Line } from "./Line";
import { GenericSchema, useDatasets, ValuesFromSchema } from "./useDatasets";

export function Page<Schema extends GenericSchema, XLabels>({
  schema,
  initialDatasets,
  newDatasetFactory,
  graphFactory,
  calculate
}: {
  schema: Schema;
  initialDatasets: { name: string; values: ValuesFromSchema<Schema> }[];
  newDatasetFactory: () => ValuesFromSchema<Schema>;
  graphFactory: () => Graph<XLabels>,
  calculate: (input: ValuesFromSchema<Schema>) => Dice<XLabels>,
}) {
  const {
    datasets,
    addDataset,
    updateDatasetValues,
    updateDatasetName,
    deleteDataset,
  } = useDatasets(
    schema,
    initialDatasets,
    newDatasetFactory
  );

  const graph = graphFactory();

  datasets.forEach((dataset) => {
    graph.addDataset(dataset.name, calculate(dataset.values));
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
      <Line data={graph.regularGraph()} />
      <Line data={graph.sumGraph()} />
    </div>
  );
}
