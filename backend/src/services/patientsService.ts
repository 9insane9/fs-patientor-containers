import { v1 as uuid } from "uuid";
import patients from "../../data/patients.ts";
import type {
  Patient,
  NewPatient,
  NonSensitivePatient,
  Entry,
  EntryWithoutId,
} from "../types.ts";

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    entries: [],
    ...patient,
  };

  patients.push(newPatient);
  return newPatient;
};

const getPatientById = (id: string): Patient => {
  const patient = patients.find((p) => id === p.id);

  if (!patient) {
    throw new Error("Patient not found!");
  }

  return patient;
};

const addEntry = (id: string, entry: EntryWithoutId): Entry => {
  const patient = patients.find((p) => id === p.id);

  if (!patient) {
    throw new Error("Patient not found!");
  }

  const newEntry: Entry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);

  return newEntry;
};

export default {
  getNonSensitivePatients,
  addPatient,
  getPatientById,
  addEntry,
};
