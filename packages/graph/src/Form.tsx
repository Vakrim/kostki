import { useRef } from "react";
import { GenericSchema, ValuesFromSchema } from "./useDatasets";

export function Form<Schema extends GenericSchema>({
  schema,
  values,
  changeValues,
  name,
  changeName,
  deleteDataset
}: {
  schema: Schema;
  values: ValuesFromSchema<Schema>;
  changeValues: (value: ValuesFromSchema<Schema>) => void;
  name: string;
  changeName: (name: string) => void;
  deleteDataset: () => void;
}) {
  const form = useRef<HTMLDivElement>(null);

  const getValues = (): ValuesFromSchema<Schema> => {
    return Object.fromEntries(
      Array.from(form.current!.querySelectorAll("input")).map((input) => [
        input.name,
        input.type === "number" ? input.value : input.checked,
      ])
    ) as unknown as ValuesFromSchema<Schema>;
  };

  return (
    <>
      <div>
        name:{" "}
        <input value={name} onChange={(e) => changeName(e.target.value)} />{" "}
        <button onClick={deleteDataset}>delete</button>
      </div>
      <div ref={form}>
        {Object.entries(schema).map(([fieldName, fieldType]) => {
          if (fieldType === "number") {
            return (
              <div key={fieldName}>
                {fieldName}:{" "}
                <input
                  type="number"
                  name={fieldName}
                  // @ts-ignore
                  value={values[fieldName]}
                  onChange={() => changeValues(getValues())}
                />
              </div>
            );
          } else if (fieldType === "boolean") {
            return (
              <div key={fieldName}>
                {fieldName}:{" "}
                <input
                  type="checkbox"
                  name={fieldName}
                  // @ts-ignore
                  checked={values[fieldName]}
                  onChange={() => changeValues(getValues())}
                />
              </div>
            );
          }
          throw new Error("unexpected type");
        })}
      </div>
    </>
  );
}
