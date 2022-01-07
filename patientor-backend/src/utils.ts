import {
  Gender, NewPatient, NewEntry,
  HealthCheckRating, Diagnosis,
  SickLeave, Discharge
} from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }

  return name;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error('Incorrect or missing dateOfBirth: ' + dateOfBirth);
  }

  return dateOfBirth;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }

  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }

  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }

  return occupation;
};

type PatientFields = { name: unknown, dateOfBirth: unknown, ssn: unknown, gender: unknown, occupation: unknown };

export const toNewPatient = ({ name, dateOfBirth, ssn, gender, occupation }: PatientFields): NewPatient => {
  const newPatient: NewPatient = {
    name: parseName(name),
    dateOfBirth: parseDateOfBirth(dateOfBirth),
    ssn: parseSsn(ssn),
    gender: parseGender(gender),
    occupation: parseOccupation(occupation),
    entries: []
  };

  return newPatient;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isType = (param: any): param is 'HealthCheck' | 'OccupationalHealthcare' | 'Hospital' => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return ['HealthCheck', 'OccupationalHealthcare', 'Hospital'].includes(param);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCheckRating).includes(param);
};

// eslint-disable-next-line @typescript-eslint/ban-types
const isObject = (object: unknown): object is Object => {
  return typeof object === 'object' || object instanceof Object;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isSickLeave = (param: any): param is SickLeave => {
  return ('startDate' in param && 'endDate' in param);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDischarge = (param: any): param is Discharge => {
  return ('date' in param && 'criteria' in param);
};

const parseType = (type: unknown) => {
  if (!type || !isString(type) || !isType(type)) {
    throw new Error('Incorrect or missing type: ' + type);
  }

  return type;
};

const parseDescription = (description: unknown) => {
  if (!description || !isString(description)) {
    throw new Error('Incorrect or missing description: ' + description);
  }

  return description;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }

  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist: ' + specialist);
  }

  return specialist;
};

const parseDiagnosisCodes = (diagnosisCodes: unknown): Array<Diagnosis['code']> | undefined => {
  if (!diagnosisCodes) {
    return undefined;
  }

  if (!Array.isArray(diagnosisCodes) || !diagnosisCodes.every(isString)) {
    throw new Error('Incorrect diagnosisCodes :' + diagnosisCodes);
  }

  return diagnosisCodes;
};

const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {
  if (!(healthCheckRating || healthCheckRating === 0) || !isHealthCheckRating(healthCheckRating)) {
    throw new Error('Incorrect or missing healthCheckRating: ' + healthCheckRating);
  }

  return healthCheckRating;
};

const parseEmployerName = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error('Incorrect or missing employerName: ' + employerName);
  }

  return employerName;
};

const parseSickLeave = (sickLeave: unknown): SickLeave | undefined => {
  if (!sickLeave) {
    return undefined;
  }
  if (!isObject(sickLeave) || !isSickLeave(sickLeave) ||
    !isDate(sickLeave.startDate) || !isDate(sickLeave.endDate)) {
    throw new Error('Incorrect sickLeave: ' + JSON.stringify(sickLeave));
  }

  return sickLeave;
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (!discharge || !isObject(discharge) || !isDischarge(discharge)
    || !isDate(discharge.date) || !isString(discharge.criteria)) {
    throw new Error('Incorrect or missing discharge: ' + JSON.stringify(discharge));
  }

  return discharge;
};

type EntryFields = {
  type: unknown, description: unknown, date: unknown, specialist: unknown, diagnosisCodes: unknown,
  healthCheckRating: unknown, employerName: unknown, sickLeave: unknown, discharge: unknown
};

export const toNewEntry = ({ type, description, date,
  specialist, diagnosisCodes, healthCheckRating,
  employerName, sickLeave, discharge }: EntryFields): NewEntry => {

  const parsedType = parseType(type);
  const baseEntry = {
    description: parseDescription(description),
    date: parseDate(date),
    specialist: parseSpecialist(specialist),
    diagnosisCodes: parseDiagnosisCodes(diagnosisCodes)
  };

  switch (parsedType) {
    case "HealthCheck": {
      const newEntry: NewEntry = {
        type: "HealthCheck",
        ...baseEntry,
        healthCheckRating: parseHealthCheckRating(healthCheckRating),
      };
      return newEntry;
    }
    case "Hospital": {
      const newEntry: NewEntry = {
        type: "Hospital",
        ...baseEntry,
        discharge: parseDischarge(discharge)
      };
      return newEntry;
    }
    case "OccupationalHealthcare": {
      const newEntry: NewEntry = {
        type: "OccupationalHealthcare",
        ...baseEntry,
        employerName: parseEmployerName(employerName),
        sickLeave: parseSickLeave(sickLeave)
      };
      return newEntry;
    }
    default: return assertNever(parsedType);
  }
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};