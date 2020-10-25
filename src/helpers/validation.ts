import i18n from '@/i18n';

export enum ValidationError {
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

export function formatError(
  error: ValidationError,
  name = i18n.tc('value')
): string {
  if (error === ValidationError.EMPTY)
    return `${name} ${i18n.tc('cannotBeEmpty')}`;
  if (error === ValidationError.NOT_A_NUMBER)
    return `${name} ${i18n.tc('shouldBeNumber')}`;
  if (error === ValidationError.NOT_POSITIVE)
    return `${name} ${i18n.tc('shouldBePositive')}`;
  return '';
}
