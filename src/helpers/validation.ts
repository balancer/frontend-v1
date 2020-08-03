enum ValidationError {
  NONE,
  EMPTY,
  NOT_A_NUMBER,
  NOT_POSITIVE
}

export function validateNumberInput(input: string): ValidationError {
  if (!input) {
    return ValidationError.EMPTY;
  }
  const number = parseFloat(input);
  if (!number) {
    return ValidationError.NOT_A_NUMBER;
  }
  if (number <= 0) {
    return ValidationError.NOT_POSITIVE;
  }
  return ValidationError.NONE;
}

export function formatError(error: ValidationError): string {
  if (error === ValidationError.EMPTY) return `Value can't be empty`;
  if (error === ValidationError.NOT_A_NUMBER) return 'Value should be a number';
  if (error === ValidationError.NOT_POSITIVE)
    return 'Value should be a positive number';
  return '';
}
