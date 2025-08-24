import { ZodError } from 'zod';

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  validationErrors?: ValidationError[];
}

export function formatZodError(error: ZodError): ValidationError[] {
  return error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
}

export function formatErrorResponse(
  error: unknown,
  defaultMessage: string = 'An error occurred'
): ApiErrorResponse {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return {
      success: false,
      error: 'Validation failed',
      message: 'Please check the following fields and try again',
      validationErrors: formatZodError(error)
    };
  }

  // Handle regular errors
  if (error instanceof Error) {
    return {
      success: false,
      error: defaultMessage,
      message: error.message
    };
  }

  // Handle unknown errors
  return {
    success: false,
    error: defaultMessage,
    message: 'Unknown error occurred'
  };
}