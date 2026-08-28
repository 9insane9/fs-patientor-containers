import express, {
  type Response,
  type Request,
  type NextFunction,
} from "express";
import patientsService from "../services/patientsService.ts";
import {
  type NonSensitivePatient,
  type NewPatient,
  type Patient,
  NewPatientSchema,
  NewEntrySchema,
  type EntryWithoutId,
  type Entry,
} from "../types.ts";
import { z } from "zod";

const patientsRouter = express.Router();

patientsRouter.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  const data = patientsService.getNonSensitivePatients();
  res.send(data);
});

patientsRouter.get("/:id", (req, res: Response<Patient>) => {
  const id = req.params.id;
  const data = patientsService.getPatientById(id);
  res.send(data);
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    req.body = NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    req.body = NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

patientsRouter.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientsService.addPatient(req.body);
    res.json(addedPatient);
  },
);

patientsRouter.post(
  "/:id/entries",
  newEntryParser,
  (
    req: Request<{ id: string }, unknown, EntryWithoutId>,
    res: Response<Entry>,
  ) => {
    const id = req.params.id;
    const addedEntry = patientsService.addEntry(id, req.body);
    res.json(addedEntry);
  },
);

patientsRouter.use(errorMiddleware);

export default patientsRouter;
