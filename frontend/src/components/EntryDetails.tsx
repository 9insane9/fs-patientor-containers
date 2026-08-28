import type {
  Entry,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
  HospitalEntry,
} from "../types";

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheck entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcare entry={entry} />;
    case "Hospital":
      return <Hospital entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;

interface HealthCheckProps {
  entry: HealthCheckEntry;
}

const healthCheckRatingLabels = {
  0: "Healthy",
  1: "Low Risk",
  2: "High Risk",
  3: "Critical Risk",
} as const;

const HealthCheck = ({ entry }: HealthCheckProps) => {
  return (
    <div style={{ border: "1px solid black" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <p>{entry.date}</p>
        <img
          src="/checkup.svg"
          alt="health check icon"
        />
      </div>
      <p style={{ fontStyle: "italic" }}>{entry.description}</p>
      <p>Status: {healthCheckRatingLabels[entry.healthCheckRating]}</p>
      <p>Diagnosed by: {entry.specialist}</p>
    </div>
  );
};

interface OccupationalHealthcareProps {
  entry: OccupationalHealthcareEntry;
}

const OccupationalHealthcare = ({ entry }: OccupationalHealthcareProps) => {
  return (
    <div style={{ border: "1px solid black" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <p>{entry.date}</p>
        <img
          src="/work.svg"
          alt="occupational check icon"
        />
        <p>{entry.employerName}</p>
      </div>
      <p style={{ fontStyle: "italic" }}>{entry.description}</p>
      {entry.sickLeave ? (
        <div>
          <h4>Sick leave:</h4>
          <p>Start: {entry.sickLeave.startDate}</p>
          <p>End: {entry.sickLeave.endDate}</p>
        </div>
      ) : null}

      <p>Diagnosed by: {entry.specialist}</p>
    </div>
  );
};

interface HospitalProps {
  entry: HospitalEntry;
}

const Hospital = ({ entry }: HospitalProps) => {
  return (
    <div style={{ border: "1px solid black" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <p>{entry.date}</p>
        <img
          src="/hospital.svg"
          alt="hospital icon"
        />
      </div>
      <p style={{ fontStyle: "italic" }}>{entry.description}</p>

      <div>
        <h4>Discharge:</h4>
        <p>Date: {entry.discharge.date}</p>
        <p>Criteria: {entry.discharge.criteria}</p>
      </div>

      <p>Diagnosed by: {entry.specialist}</p>
    </div>
  );
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled value: ${value}`);
};
