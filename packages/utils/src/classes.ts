type ClassValue = string | Record<string, boolean | null | undefined> | null | undefined;

export function cx(...classes: ClassValue[]): string {
  const result: string[] = [];

  classes.forEach((item) => {
    if (!item) {
      return;
    }

    if (typeof item === "string") {
      result.push(item);
      return;
    }

    Object.keys(item).forEach((key) => {
      if (item[key]) {
        result.push(key);
      }
    });
  });

  return result.join(" ");
}

export default cx;
