import { describe, test, expect } from "vitest";
import {
  formatPrice,
  formatDate,
  deepEqual,
  doesEmailHaveTopLevelDomain,
  getPasswordValidationMessage,
  deleteKeysIncludingString,
} from "../utils/helpers";

describe("formatPrice", () => {
  test("formats price correctly", () => {
    expect(formatPrice(1000)).toBe("1,000");
    expect(formatPrice(5000)).toBe("5,000");
    expect(formatPrice(10000)).toBe("10,000");
  });
});

describe("formatDate", () => {
  test("formats date correctly", () => {
    const date = new Date("2021-01-01");
    expect(formatDate(date)).toBe("01/01/2021");
  });
});

describe("deepEqual", () => {
  test("checks deep equality correctly", () => {
    const obj1 = { name: "John", age: 30, address: { city: "New York", country: "USA" } };
    const obj2 = { name: "John", age: 30, address: { city: "New York", country: "USA" } };
    const obj3 = { name: "John", age: 30, address: { city: "Los Angeles", country: "USA" } };

    expect(deepEqual(obj1, obj2)).toBe(true);
    expect(deepEqual(obj1, obj3)).toBe(false);
  });
});

describe("doesEmailHaveTopLevelDomain", () => {
  test("checks if email has a top-level domain", () => {
    expect(doesEmailHaveTopLevelDomain("example@test")).toBe(false);
    expect(doesEmailHaveTopLevelDomain("example@test.")).toBe(false);
    expect(doesEmailHaveTopLevelDomain("example@test.com")).toBe(true);
    expect(doesEmailHaveTopLevelDomain("example@test.co.uk")).toBe(true);
  });
});

describe("getPasswordValidationMessage", () => {
  test("returns the correct password validation message", () => {
    expect(getPasswordValidationMessage("")).toBe("Please enter a password.");
    expect(getPasswordValidationMessage("1234567")).toBe(
      "Your password must be at least eight characters long."
    );
    expect(getPasswordValidationMessage("password")).toBe(
      "Your password must include at least one uppercase letter."
    );
    expect(getPasswordValidationMessage("PASSWORD")).toBe(
      "Your password must include at least one lowercase letter."
    );
    expect(getPasswordValidationMessage("Password1")).toBe(
      "Your password must include at least one special character."
    );
    expect(getPasswordValidationMessage("Password@")).toBe(
      "Your password must include at least one digit."
    );
    expect(getPasswordValidationMessage("StrongPassword1@")).toBe("");
  });
});

describe("deleteKeysIncludingString", () => {
  test("deletes keys including the specified string", () => {
    const urlParams = new URLSearchParams();
    urlParams.append("param1", "value1");
    urlParams.append("param2", "value2");
    urlParams.append("param3", "value3");
    urlParams.append("param4", "value4");

    const deletedParams = deleteKeysIncludingString(urlParams, "param");
    expect(deletedParams.has("param1")).toBe(false);
    expect(deletedParams.has("param2")).toBe(false);
    expect(deletedParams.has("param3")).toBe(false);
    expect(deletedParams.has("param4")).toBe(false);
  });
});