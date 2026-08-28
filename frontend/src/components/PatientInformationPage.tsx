import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import patientService from "../services/patients";
import type { Patient } from "../types";
import EntryDetails from "./EntryDetails";
import NewEntryForm from "./NewEntryForm";

const PatientInformationPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchPatient = async (id: string) => {
      const patientData = await patientService.getById(id);
      setPatient(patientData);
    };

    void fetchPatient(id);
  }, [id]);

  if (!id) {
    return <div>Invalid patient id</div>;
  }

  if (!patient) {
    return <p>Loading...</p>;
  }

  const updatePatient = async () => {
    const updated = await patientService.getById(id);
    setPatient(updated);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <h2>{patient.name}</h2>
        <img
          src={
            patient.gender === "male"
              ? "/male.svg"
              : patient.gender === "female"
                ? "/female.svg"
                : "/other.svg"
          }
          alt="gender icon"
        />
      </div>

      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      <p>date of birth: {patient.dateOfBirth}</p>

      <div>
        <NewEntryForm
          id={id}
          updatePatient={updatePatient}
        />
        <h3>Entries</h3>

        {patient.entries.map((e) => (
          <EntryDetails
            key={e.id}
            entry={e}
          />
        ))}
      </div>
    </div>
  );
};

export default PatientInformationPage;
