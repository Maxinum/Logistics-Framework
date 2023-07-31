import { mutate } from "swr";
import { GenericObject, PriceList } from "./types";

/**
 * Formats the given price as a string with commas for thousands separator.
 * @param price The price to format.
 * @returns The formatted price string.
 */
export const formatPrice = (price: number) => {
  const stringPrice = String(price.toFixed());
  return stringPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Formats the given date as a string in "MM/DD/YYYY" format.
 * @param date The date to format.
 * @returns The formatted date string.
 */
export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const isObject = (object: GenericObject) => {
  return object != null && typeof object === "object";
};

/**
 * Checks if two objects are deeply equal, ignoring specified keys.
 * @param obj1 The first object to compare.
 * @param obj2 The second object to compare.
 * @param keysToIgnore An array of keys to ignore during comparison.
 * @returns True if the objects are deeply equal, false otherwise.
 */
export const deepEqual = <T extends GenericObject>(obj1: T, obj2: T, keysToIgnore: (keyof T)[] = []): boolean => {
  const keys1 = Object.keys(obj1).filter(key => !keysToIgnore.includes(key));
  const keys2 = Object.keys(obj2).filter(key => !keysToIgnore.includes(key));

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2, keysToIgnore)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
};

/**
 * Checks if the given email has a top-level domain.
 * @param email The email to check.
 * @returns True if the email has a top-level domain, false otherwise.
 */
export const doesEmailHaveTopLevelDomain = (email: string) => {
  const [, domain] = email.split("@");
  const indexOfTopLevelDomain = domain.indexOf(".");

  if (indexOfTopLevelDomain < 0 || indexOfTopLevelDomain > domain.length - 3) {
    return false;
  }

  return true;
};

/**
 * Returns the validation message for the given password.
 * @param password The password to validate.
 * @returns The validation message for the password.
 */
export const getPasswordValidationMessage = (password: string) => {
  if (!password) {
    return "Please enter a password.";
  }

  if (password.length < 8) {
    return "Your password must be at least eight characters long.";
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return "Your password must include at least one lowercase letter.";
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return "Your password must include at least one uppercase letter.";
  }

  if (!/(?=.*\d)/.test(password)) {
    return "Your password must include at least one digit.";
  }

  if (!/(?=.*[!@#$%^&*])/i.test(password)) {
    return "Your password must include at least one special character.";
  }

  return "";
};

/**
 * Performs a flexible search of keys in urlParams and deletes them.
 * @param urlParams The URLSearchParams object to operate on.
 * @param stringToFind The string to search for in the keys.
 * @returns A new URLSearchParams object with the matching keys deleted.
 */
export const deleteKeysIncludingString = (urlParams: URLSearchParams, stringToFind: string) => {
  const paramsCopy = new URLSearchParams(urlParams);

  for (const key of urlParams.keys()) {
    if (key.includes(stringToFind)) paramsCopy.delete(key);
  }

  return paramsCopy;
};

/**
 * Revalidates the {@link https://swr.vercel.app/docs/arguments SWR cache for the given query key}.
 * @param queryKey The query key to revalidate.
 */
export const revalidateCache = async (queryKey: string) => {
  await mutate(
    key => (queryKey === key) || (Array.isArray(key) && key.includes(queryKey)),
    undefined,
    { revalidate: true }
  );
};

/**
 * Gets the correct price list title by category
 * @param category The price list category
 */
export const getCategoryTitle = (category: PriceList["category"]) => {
  switch (category) {
    case "cc-destination":
      return "Customs Clearance at Destination Offer";
    case "inland-carrier":
      return "Inland Carrier at Destination Offer";
    case "forwarder":
      return "Forwarder Offer";
    case "inland-supplier":
      return "Inland Carrier Offer";
    default:
      return "Local Charges Offer";
  }
};