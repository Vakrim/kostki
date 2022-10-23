import { useRef } from "react";

type Schema = Record<string, "number" | "boolean">;

export function Form<S extends Schema>({
  schema,
  value,
  onChange,
}: {
  schema: S;
  value: OutcomeFromSchema<S>;
  onChange: (value: OutcomeFromSchema<S>) => void;
}) {
  const form = useRef<HTMLDivElement>(null);

  const getValues = (): OutcomeFromSchema<S> => {
    return Object.fromEntries(
      Array.from(form.current!.querySelectorAll("input")).map((input) => [
        input.name,
        input.type === "number" ? input.value : input.checked,
      ])
    ) as unknown as OutcomeFromSchema<S>;
  };

  return (
    <div ref={form}>
      {Object.entries(schema).map(([fieldName, fieldType]) => {
        if (fieldType === "number") {
          return (
            <div key={fieldName}>
              {fieldName}:
              <input
                type="number"
                name={fieldName}
                // @ts-ignore
                value={value[fieldName]}
                onChange={() => onChange(getValues())}
              />
            </div>
          );
        } else if (fieldType === "boolean") {
          return (
            <div key={fieldName}>
              {fieldName}:
              <input
                type="checkbox"
                name={fieldName}
                // @ts-ignore
                checked={value[fieldName]}
                onChange={() => onChange(getValues())}
              />
            </div>
          );
        }
        throw new Error('unexpected type');
      })}
    </div>
  );
}

type OutcomeFromSchema<S extends Schema> = {
  [key in keyof S]: FieldType<S[key]>;
};

type FieldType<T> = T extends "number"
  ? number
  : T extends "boolean"
  ? boolean
  : never;
