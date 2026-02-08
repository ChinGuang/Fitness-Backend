type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
  ? DeepPartial<T[K]> | undefined
  : T[K] | undefined;
};

export function assignDefined<T>(target: T, source: Partial<T>) {
  for (const key in source) {
    const value = source[key];
    if (value !== undefined) {
      target[key] = value;
    }
  }
}

export function assignDefinedDeep<T>(target: T, source: DeepPartial<T>) {
  for (const key in source) {
    const value = source[key];

    if (value === undefined) continue;

    if (
      typeof value === "object" &&
      value !== null &&
      typeof target[key] === "object" &&
      target[key] !== null
    ) {
      assignDefinedDeep(target[key], value);
    } else {
      target[key] = value as T[typeof key];
    }
  }
}
