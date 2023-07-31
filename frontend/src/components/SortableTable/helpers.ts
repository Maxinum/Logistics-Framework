import { GenericObject } from "../../utils/types";

const getNestedValue = (obj: GenericObject, path: string) => {
  if (path.includes(".")) return obj[path];
  return path.split(".").reduce((prev, curr) => prev ? prev[curr] : null, obj);
};

const descendingComparator = (a: any, b: any, orderBy: string) => { // eslint-disable-line
  const leftOp = getNestedValue(a, orderBy);
  const rightOp = getNestedValue(b, orderBy);

  if (leftOp < rightOp) return 1;
  if (leftOp > rightOp) return -1;
  return 0;
};

export const getComparator = (order: "desc" | "asc", orderBy: string) => {
  return order === "desc"
    ? (a: any, b: any) => descendingComparator(a, b, orderBy) // eslint-disable-line
    : (a: any, b: any) => -descendingComparator(a, b, orderBy); // eslint-disable-line
};

export const stableSort = (array: any[], comparator: (a: any, b: any) => number) => { // eslint-disable-line
  const stabilizedThis = array.map((item, index) => [item, index]);

  stabilizedThis.sort((a, b) => comparator(a[0], b[0]));

  return stabilizedThis.map((item) => item[0]);
};