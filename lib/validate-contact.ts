export type ContactFields = {
  name: string;
  email: string;
  projectType: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(fields: ContactFields): ContactErrors {
  const errs: ContactErrors = {};
  if (fields.name.trim().length < 2) {
    errs.name = "Please enter your full name.";
  }
  if (!EMAIL_RE.test(fields.email.trim())) {
    errs.email = "Please enter a valid email address.";
  }
  if (!fields.projectType.trim()) {
    errs.projectType = "Please select a project type.";
  }
  if (fields.message.trim().length < 20) {
    errs.message = "Tell me a bit more — at least 20 characters.";
  }
  return errs;
}
