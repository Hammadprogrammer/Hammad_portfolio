import { describe, it, expect } from "vitest";
import { validateContact } from "../lib/validate-contact";

const valid = {
  name: "Muhammad Hammad",
  email: "hammadzahid221@gmail.com",
  projectType: "Web Application",
  message: "I want to build a full stack e-commerce platform with Next.js.",
};

describe("validateContact", () => {
  it("accepts a fully valid submission", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("rejects an empty name", () => {
    expect(validateContact({ ...valid, name: "" }).name).toBeTruthy();
  });

  it("rejects a one-character name", () => {
    expect(validateContact({ ...valid, name: "M" }).name).toBeTruthy();
  });

  it("trims whitespace-only names", () => {
    expect(validateContact({ ...valid, name: "   " }).name).toBeTruthy();
  });

  it.each([
    "plainaddress",
    "missing@tld",
    "@nouser.com",
    "spaces in@mail.com",
    "double@@at.com",
  ])("rejects invalid email: %s", (email) => {
    expect(validateContact({ ...valid, email }).email).toBeTruthy();
  });

  it.each(["a@b.co", "user.name+tag@example.io", "x_y@sub.domain.org"])(
    "accepts valid email: %s",
    (email) => {
      expect(validateContact({ ...valid, email }).email).toBeUndefined();
    }
  );

  it("requires a project type", () => {
    expect(validateContact({ ...valid, projectType: "" }).projectType).toBeTruthy();
  });

  it("rejects a message under 20 characters", () => {
    expect(validateContact({ ...valid, message: "too short" }).message).toBeTruthy();
  });

  it("accepts a message of exactly 20 characters", () => {
    expect(
      validateContact({ ...valid, message: "x".repeat(20) }).message
    ).toBeUndefined();
  });

  it("reports all errors at once for an empty form", () => {
    const errs = validateContact({ name: "", email: "", projectType: "", message: "" });
    expect(Object.keys(errs).sort()).toEqual(["email", "message", "name", "projectType"]);
  });
});
