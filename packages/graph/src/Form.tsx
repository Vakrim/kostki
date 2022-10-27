import { useRef } from "react";
import { GenericSchema, ValuesFromSchema } from "./useDatasets";

export function Form<Schema extends GenericSchema>({
  schema,
  values,
  changeValues,
  name,
  changeName,
  deleteDataset,
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
    const values: any = {};

    form.current!.querySelectorAll("input").forEach((input) => {
      values[input.name] =
        input.type === "number" ? parseInt(input.value) : input.checked;
    });

    form.current!.querySelectorAll("select").forEach((select) => {
      values[select.name] = select.value;
    });

    return values;
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
          } else if ("enum" in fieldType) {
            return (
              <div key={fieldName}>
                {fieldName}:{" "}
                <select
                  name={fieldName}
                  // @ts-ignore
                  value={values[fieldName]}
                  onChange={() => changeValues(getValues())}
                >
                  {fieldType.enum.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
          throw new Error("unexpected type");
        })}
      </div>
    </>
  );
}
