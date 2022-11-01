// Source: https://raw.githubusercontent.com/facebookexperimental/Recoil/74ec626/packages/shared/util/Recoil_stableStringify.js

export function stableStringify(x: unknown, key?: string): string {
  // A optimization to avoid the more expensive JSON.stringify() for simple strings
  // This may lose protection for u2028 and u2029, though.
  if (typeof x === "string" && !x.includes('"') && !x.includes("\\")) {
    return `"${x}"`;
  }

  // Handle primitive types
  switch (typeof x) {
    case "undefined":
      return ""; // JSON.stringify(undefined) returns undefined, but we always want to return a string
    case "boolean":
      return x ? "true" : "false";
    case "number":
    case "symbol":
      // case 'bigint': // BigInt is not supported in www
      return String(x);
    case "string":
      // Add surrounding quotes and escape internal quotes
      return JSON.stringify(x);
    case "function":
      throw new Error("Attempt to serialize function");
  }

  if (x === null) {
    return "null";
  }

  // Fallback case for unknown types
  if (typeof x !== "object") {
    return JSON.stringify(x) ?? "";
  }

  // Deal with all promises as equivalent for now.
  if (isPromise(x)) {
    return "__PROMISE__";
  }

  // Arrays handle recursive stringification
  if (Array.isArray(x)) {
    return `[${x.map((v, i) => stableStringify(v, i.toString()))}]`;
  }

  // If an object defines a toJSON() method, then use that to override the
  // serialization.  This matches the behavior of JSON.stringify().
  // Pass the key for compatibility.
  // Immutable.js collections define this method to allow us to serialize them.
  if (typeof (x as any).toJSON === "function") {
    // flowlint-next-line unclear-type: off
    return stableStringify((x as any).toJSON(key), key);
  }

  // For built-in Maps, sort the keys in a stable order instead of the
  // default insertion order.  Support non-string keys.
  if (x instanceof Map) {
    const obj: Record<string, any> = {};
    for (const [k, v] of x) {
      // Stringify will escape any nested quotes
      obj[typeof k === "string" ? k : stableStringify(k)] = v;
    }
    return stableStringify(obj, key);
  }

  // For built-in Sets, sort the keys in a stable order instead of the
  // default insertion order.
  if (x instanceof Set) {
    return stableStringify(
      Array.from(x).sort((a, b) => stableStringify(a).localeCompare(stableStringify(b))),
      key
    );
  }

  // For all other Objects, sort the keys in a stable order.
  return `{${Object.keys(x)
    .filter((k) => x[k as keyof typeof x] !== undefined)
    .sort()
    // stringify the key to add quotes and escape any nested slashes or quotes.
    .map((k) => `${stableStringify(k)}:${stableStringify(x[k as keyof typeof x], k)}`)
    .join(",")}}`;
}

function isPromise(p: any): p is Promise<unknown> {
  return !!p && "then" in p && typeof p.then === "function";
}
