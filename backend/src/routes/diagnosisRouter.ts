import express, { type Response } from "express";
import diagnosisService from "../services/diagnosisService.ts";
import type { Diagnosis } from "../types.ts";

const diagnosesRouter = express.Router();

diagnosesRouter.get("/", (_req, res: Response<Diagnosis[]>) => {
  const data = diagnosisService.getDiagnoses();
  res.send(data);
});

export default diagnosesRouter;
