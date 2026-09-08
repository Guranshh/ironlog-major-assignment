// Every server action validates its input before touching the database.
// Each validator returns the cleaned value, or throws if the shape is wrong.

export const validateUrlId = (value: unknown): string => {
  if (typeof value !== "string") { // wrong type entirely
    throw new Error("urlId must be a string");
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) { // empty or whitespace only
    throw new Error("urlId must not be empty");
  }

  if (!/^[a-z0-9-]+$/.test(trimmed)) { // slugs only contain lowercase letters, digits and hyphens
    throw new Error("urlId has an invalid format");
  }

  return trimmed;
};

export type PostUpdate = {
  title: string;
  description: string;
  content: string;
  tags: string;
};

const validateText = (value: unknown, field: string, max: number): string => {
  if (typeof value !== "string") {
    throw new Error(`${field} must be a string`);
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error(`${field} must not be empty`);
  }

  if (trimmed.length > max) { // an upper bound stops absurdly large writes
    throw new Error(`${field} must be ${max} characters or fewer`);
  }

  return trimmed;
};

export const validatePostUpdate = (value: unknown): PostUpdate => {
  if (typeof value !== "object" || value === null) { // structure check before reading properties
    throw new Error("Update data must be an object");
  }

  const data = value as Record<string, unknown>; // now safe to read keys off it

  return {
    title: validateText(data.title, "title", 200),
    description: validateText(data.description, "description", 1000),
    content: validateText(data.content, "content", 20000),
    tags: validateText(data.tags, "tags", 200),
  };
};