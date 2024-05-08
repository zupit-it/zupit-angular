import { inject } from "@angular/core";

import { ERROR_EXPECTED_MISSING_VALUE } from "../config";

export class FormException extends Error {
  constructor(public errorCode: string) {
    super(errorCode);
  }
}

export function getValueOrError<T>(value: T | null | undefined): T {
  if (value == null) {
    throw new FormException(inject(ERROR_EXPECTED_MISSING_VALUE));
  }
  return value;
}
