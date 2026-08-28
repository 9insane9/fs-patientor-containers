// // // import z from "zod";
// // // import type { NewPatient } from "./types.ts";
// // // import { GenderValues } from "./types.ts";

// // // export const parseNewPatient = (object: unknown): NewPatient => {
//   if (!object || typeof object !== "object") {
//     throw new Error("Incorrect or missing data");
//   }

//   if (
//     "name" in object &&
//     "dateOfBirth" in object &&
//     "ssn" in object &&
//     "gender" in object &&
//     "occupation" in object
//   ) {
//     const newPatient: NewPatient = {
//       name: z.string().parse(object.name),
//       dateOfBirth: z.iso.date().parse(object.dateOfBirth),
//       ssn: z.string().parse(object.ssn),
//       gender: parseGender(object.gender),
//       occupation: z.string().parse(object.occupation),
//     };

// return newPatient;
// // //   return NewPatientSchema.parse(object);
// // // };

//   throw new Error("Incorrect data: some fields are missing");
// };

// const isGender = (param: string): param is Gender => {
//   return (Object.values(GenderValues) as string[]).includes(param);
// };

// const parseGender = (gender: unknown): Gender => {
//   if (!isString(gender) || !isGender(gender)) {
//     throw new Error("Incorrect or missing gender");
//   }
//   return gender;
// };

// const isString = (text: unknown): text is string => {
//   return typeof text === "string" || text instanceof String;
// };

// const parseString = (text: unknown): string => {
//   if (!isString(text)) {
//     throw new Error("Not a valid string!");
//   }
//   return text;
// };

// const isDate = (date: string): boolean => {
//   return !isNaN(Date.parse(date));
// };

// const parseDate = (date: unknown): string => {
//   if (!isString(date) || !isDate(date)) {
//     throw new Error("Incorrect or missing date: " + date);
//   }
//   return date;
// };
