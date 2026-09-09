// The form data every field validates against.
export type PostForm = {
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
};

// One error message per field, keyed by field name. Empty object means valid.
export type FormErrors = Partial<Record<keyof PostForm, string>>;

const isValidUrl = (value: string): boolean => {
  try {
    new URL(value); // the browser's own parser decides, rather than a hand-written regex
    return true;
  } catch {
    return false;
  }
};

export function validateForm(form: PostForm): FormErrors {
  const errors: FormErrors = {};

  if (!form.title.trim()) {
    errors.title = "Title is required";
  }

  if (!form.description.trim()) {
    errors.description = "Description is required";
  } else if (form.description.length > 200) {
    errors.description = "Description is too long. Maximum is 200 characters";
  }

  if (!form.content.trim()) {
    errors.content = "Content is required";
  }

  if (!form.imageUrl.trim()) {
    errors.imageUrl = "Image URL is required";
  } else if (!isValidUrl(form.imageUrl)) {
    errors.imageUrl = "This is not a valid URL";
  }

  if (!form.tags.trim()) {
    errors.tags = "At least one tag is required";
  }

  return errors;
}