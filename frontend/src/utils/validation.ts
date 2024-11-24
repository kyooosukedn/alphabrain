import type { LoginCredentials, RegisterCredentials } from '../types';

export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return 'Email is required';
  }
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(email)) {
    return 'Invalid email address';
  }
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }
};

export const validateLoginForm = (values: LoginCredentials) => {
  const errors: Partial<Record<keyof LoginCredentials, string>> = {};

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};

export const validateRegisterForm = (values: RegisterCredentials) => {
  const errors: Partial<Record<keyof RegisterCredentials, string>> = {};

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  if (!values.name) {
    errors.name = 'Name is required';
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const validateSessionForm = (values: {
  title: string;
  startTime: Date;
  endTime: Date;
}) => {
  const errors: Record<string, string> = {};

  if (!values.title) {
    errors.title = 'Title is required';
  }

  if (!values.startTime) {
    errors.startTime = 'Start time is required';
  }

  if (!values.endTime) {
    errors.endTime = 'End time is required';
  }

  if (values.startTime && values.endTime && values.startTime >= values.endTime) {
    errors.endTime = 'End time must be after start time';
  }

  return errors;
};

export const validateProgressForm = (values: {
  metric: string;
  value: number;
}) => {
  const errors: Record<string, string> = {};

  if (!values.metric) {
    errors.metric = 'Metric is required';
  }

  if (typeof values.value !== 'number' || isNaN(values.value)) {
    errors.value = 'Value must be a number';
  }

  return errors;
};
