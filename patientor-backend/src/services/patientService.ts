import patientData from '../../data/patients';

import { v1 as uuid } from 'uuid';

import { NewPatient, PublicPatient, Patient, NewEntry, Entry } from '../types';

const patients: Patient[] = patientData;

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    id: uuid(),
    ...patient
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: NewEntry): Entry => {
  const newEntry = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    id: uuid(),
    ...entry
  };
  patients.find(p => p.id === id)?.entries.push(newEntry);
  return newEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
  addEntry
};