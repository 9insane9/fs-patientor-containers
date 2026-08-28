import z from "zod";

export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};
/////
export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
}

export const HealthCheckRatingValues = {
  Healthy: 0,
  LowRisk: 1,
  HighRisk: 2,
  CriticalRisk: 3,
} as const;

export type HealthCheckRating =
  (typeof HealthCheckRatingValues)[keyof typeof HealthCheckRatingValues];

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}
//////

type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

export type EntryWithoutId = UnionOmit<Entry, "id">;
//zod
const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.iso.date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

export const NewEntrySchema = z.discriminatedUnion("type", [
  BaseEntrySchema.extend({
    type: z.literal("Hospital"),
    discharge: z.object({
      date: z.iso.date(),
      criteria: z.string(),
    }),
  }),
  BaseEntrySchema.extend({
    type: z.literal("OccupationalHealthcare"),
    employerName: z.string(),
    sickLeave: z
      .object({
        startDate: z.iso.date(),
        endDate: z.iso.date(),
      })
      .optional(),
  }),
  BaseEntrySchema.extend({
    type: z.literal("HealthCheck"),
    healthCheckRating: z.union([
      z.literal(HealthCheckRatingValues.Healthy),
      z.literal(HealthCheckRatingValues.LowRisk),
      z.literal(HealthCheckRatingValues.HighRisk),
      z.literal(HealthCheckRatingValues.CriticalRisk),
    ]),
  }),
]);

//////
export interface Patient extends NewPatient {
  id: string;
  entries: Entry[];
}

export const GenderValues = {
  Male: "male",
  Female: "female",
  Other: "other",
} as const;

export type Gender = (typeof GenderValues)[keyof typeof GenderValues];

export type NewPatient = z.infer<typeof NewPatientSchema>;

export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(GenderValues),
  occupation: z.string(),
});

//////
