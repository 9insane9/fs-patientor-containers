import { useState, useEffect, SyntheticEvent } from "react";
import patientsService from "../services/patients";
import { HealthCheckRatingValues } from "../types";
import type {
  EntryWithoutId,
  Entry,
  HealthCheckRating,
  Diagnosis,
} from "../types";
import { ZodIssue } from "zod/v3";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  TextField,
  Chip,
  Box,
  Button,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import diagnosesService from "../services/diagnoses";

interface Props {
  id: string;
  updatePatient: () => Promise<void>;
}

const NewEntryForm = ({ id, updatePatient }: Props) => {
  const [errors, setErrors] = useState<Array<string>>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  const [entryType, setEntryType] = useState<Entry["type"]>("HealthCheck");
  // const [date, setDate] = useState<Dayjs | null>(null); //ffs
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [codes, setCodes] = useState<Array<string>>([]);
  ///HealthCheck
  const [rating, setRating] = useState<HealthCheckRating>(
    HealthCheckRatingValues.Healthy,
  );
  //Hospital
  const [dischargeDate, setDischargeDate] = useState<Dayjs | null>(null);
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  //OccupationalHealthcare
  const [employer, setEmployer] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState<Dayjs | null>(null);
  const [sickLeaveEnd, setSickLeaveEnd] = useState<Dayjs | null>(null);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const data = await diagnosesService.getAll();
      setDiagnoses(data);
    };

    void fetchDiagnoses();
  }, []);

  const assertNever = (value: never): never => {
    throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
  };

  const addEntry = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const base = {
        // date: date ? date.format("YYYY-MM-DD") : "",
        date,
        description,
        specialist,
        diagnosisCodes: codes.length > 0 ? codes : undefined,
      };

      let entry: EntryWithoutId;

      switch (entryType) {
        case "HealthCheck":
          entry = {
            ...base,
            type: "HealthCheck",
            healthCheckRating: rating,
          };
          break;

        case "Hospital":
          entry = {
            ...base,
            type: "Hospital",
            discharge: {
              date: dischargeDate ? dischargeDate.format("YYYY-MM-DD") : "",
              criteria: dischargeCriteria,
            },
          };
          break;

        case "OccupationalHealthcare":
          entry = {
            ...base,
            type: "OccupationalHealthcare",
            employerName: employer,
            sickLeave:
              sickLeaveStart && sickLeaveEnd
                ? {
                    startDate: sickLeaveStart.format("YYYY-MM-DD"),
                    endDate: sickLeaveEnd.format("YYYY-MM-DD"),
                  }
                : undefined,
          };
          break;

        default:
          return assertNever(entryType);
      }

      await patientsService.addEntry(id, entry);
      await updatePatient();

      setErrors([]);
      resetForm();
    } catch (error: unknown) {
      if (typeof error === "object" && error && "response" in error) {
        const axiosError = error as {
          response: {
            data: {
              error: ZodIssue[];
            };
          };
        };

        setErrors(
          axiosError.response.data.error.map(
            (e) => `${e.path.join(".")}: ${e.message}`,
          ),
        );
      } else {
        setErrors(["Unknown error"]);
      }
    }
  };

  const resetForm = () => {
    setEntryType("HealthCheck");

    setDate("");
    setDescription("");
    setSpecialist("");
    setCodes([]);

    setRating(HealthCheckRatingValues.Healthy);

    setDischargeDate(null);
    setDischargeCriteria("");

    setEmployer("");
    setSickLeaveStart(null);
    setSickLeaveEnd(null);

    setErrors([]);
  };

  const entryTypes: Entry["type"][] = [
    "HealthCheck",
    "OccupationalHealthcare",
    "Hospital",
  ];
  const entryTypeLabels: Record<Entry["type"], string> = {
    HealthCheck: "Health Check",
    OccupationalHealthcare: "Occupational Healthcare",
    Hospital: "Hospital",
  };

  const handleEntryTypeChange = (event: SelectChangeEvent<Entry["type"]>) => {
    setEntryType(event.target.value as Entry["type"]);
  };

  const handleCodesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setCodes(typeof value === "string" ? value.split(",") : value);
  };

  //HEALTH CHECK

  const healthRatingOptions: {
    value: HealthCheckRating;
    label: string;
  }[] = [
    { value: HealthCheckRatingValues.Healthy, label: "0 — Healthy" },
    { value: HealthCheckRatingValues.LowRisk, label: "1 — Low Risk" },
    { value: HealthCheckRatingValues.HighRisk, label: "2 — High Risk" },
    { value: HealthCheckRatingValues.CriticalRisk, label: "3 — Critical Risk" },
  ];

  return (
    <div>
      <h1>New Entry</h1>
      {/* ERRORS */}
      {errors.length > 0 && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Alert>
      )}

      <form
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        onSubmit={addEntry}
      >
        {/* ENTRY TYPE */}
        <FormControl fullWidth>
          <InputLabel id="typeSelectLabel">Entry Type</InputLabel>
          <Select
            labelId=""
            id="typeSelect"
            value={entryType}
            label="Entry type"
            onChange={handleEntryTypeChange}
          >
            {entryTypes.map((type) => (
              <MenuItem
                key={type}
                value={type}
              >
                {entryTypeLabels[type]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/*//// BASIC INFO ////*/}
        {/* DATE */}
        {/* <DatePicker
          label="Date"
          value={date}
          format="DD.MM.YYYY"
          onChange={(newValue) => setDate(newValue)}
        /> */}
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        {/* DESCRIPTION */}
        <TextField
          label="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* SPECIALIST */}
        <TextField
          required
          label="Specialist"
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
        />
        {/* DIAGNOSIS CODES */}
        <FormControl fullWidth>
          <InputLabel id="codes-label">Diagnoses</InputLabel>

          <Select
            labelId="codes-label"
            id="codes"
            multiple
            value={codes}
            onChange={handleCodesChange}
            label="Diagnoses"
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                  />
                ))}
              </Box>
            )}
          >
            {diagnoses.map((d) => (
              <MenuItem
                key={d.code}
                value={d.code}
              >
                {d.code} — {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* HEALTH CHECK */}
        {entryType === "HealthCheck" && (
          <>
            <Select
              required
              value={rating}
              onChange={(e) =>
                setRating(Number(e.target.value) as HealthCheckRating)
              }
            >
              {healthRatingOptions.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
        {/* HOSPITAL */}
        {entryType === "Hospital" && (
          <>
            <DatePicker
              label="Discharge date *"
              value={dischargeDate}
              format="DD.MM.YYYY"
              onChange={(v) => setDischargeDate(v)}
            />

            <TextField
              required
              label="Discharge criteria"
              value={dischargeCriteria}
              onChange={(e) => setDischargeCriteria(e.target.value)}
              fullWidth
            />
          </>
        )}

        {/* OCCUPATIONAL */}
        {entryType === "OccupationalHealthcare" && (
          <>
            <TextField
              label="Employer name"
              required
              value={employer}
              onChange={(e) => setEmployer(e.target.value)}
              fullWidth
            />

            <DatePicker
              label="Sick leave start"
              value={sickLeaveStart}
              format="DD.MM.YYYY"
              onChange={(v) => setSickLeaveStart(v)}
            />

            <DatePicker
              label="Sick leave end"
              value={sickLeaveEnd}
              format="DD.MM.YYYY"
              onChange={(v) => setSickLeaveEnd(v)}
            />
          </>
        )}

        {/* BUTTONS */}
        <div style={{ display: "flex", justifyContent: "left", gap: "10px" }}>
          {" "}
          <Button
            variant="contained"
            type="submit"
          >
            Add New Entry
          </Button>
          <Button
            onClick={resetForm}
            variant="outlined"
            type="button"
          >
            CANCEL
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewEntryForm;
