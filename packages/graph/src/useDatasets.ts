import { useCallback, useReducer } from "react";

export function useDatasets<Schema extends GenericSchema>(
  schema: Schema,
  initialState: { name: string; values: ValuesFromSchema<Schema> }[],
  newDatasetFactory: () => ValuesFromSchema<Schema>
) {
  const [datasets, dispatch] = useReducer(
    (
      prev: { id: number; name: string; values: ValuesFromSchema<Schema> }[],
      action:
        | {
            type: "add dataset";
          }
        | {
            type: "update dataset values";
            id: number;
            values: ValuesFromSchema<Schema>;
          }
        | {
            type: "update dataset name";
            id: number;
            name: string;
          }
        | {
            type: "delete dataset";
            id: number;
          }
    ) => {
      switch (action.type) {
        case "add dataset":
          return [
            ...prev,
            { id: nextId(), name: "", values: newDatasetFactory() },
          ];
        case "update dataset values":
          return prev.map((dataset) => {
            if (dataset.id !== action.id) {
              return dataset;
            }
            return {
              ...dataset,
              values: action.values,
            };
          });
        case "update dataset name":
          return prev.map((dataset) => {
            if (dataset.id !== action.id) {
              return dataset;
            }
            return {
              ...dataset,
              name: action.name,
            };
          });
        case "delete dataset":
          return prev.filter((dataset) => dataset.id !== action.id);
        default:
          return prev;
      }
    },
    initialState.map((is) => ({ ...is, id: nextId() }))
  );

  const addDataset = useCallback(() => dispatch({ type: "add dataset" }), []);

  const updateDatasetValues = useCallback(
    (id: number, values: ValuesFromSchema<Schema>) =>
      dispatch({ type: "update dataset values", id, values }),
    []
  );

  const updateDatasetName = useCallback(
    (id: number, name: string) =>
      dispatch({ type: "update dataset name", id, name }),
    []
  );

  const deleteDataset = useCallback(
    (id: number) => dispatch({ type: "delete dataset", id }),
    []
  );

  return {
    datasets,
    schema,
    addDataset,
    updateDatasetValues,
    updateDatasetName,
    deleteDataset,
  };
}

export type GenericSchema = Record<
  string,
  "number" | "boolean" | { enum: readonly string[] }
>;

export type ValuesFromSchema<S extends GenericSchema> = {
  [key in keyof S]: FieldType<S[key]>;
};

export type FieldType<T> = T extends { enum: ReadonlyArray<infer E> }
  ? E
  : T extends "number"
  ? number
  : T extends "boolean"
  ? boolean
  : never;

let lastId = 0;

function nextId() {
  return lastId++;
}
