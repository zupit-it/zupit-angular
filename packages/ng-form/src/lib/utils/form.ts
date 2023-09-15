import { AbstractControl, FormArray, FormGroup } from '@angular/forms'
import { AppException, getValueOrError } from './errors'

export function setFormEnabled(
  form: AbstractControl,
  enabled: boolean,
  options?: { disableFields?: string[]; force?: boolean }
): void {
  const force = options?.force ?? false
  if (enabled && (form.disabled || force)) {
    form.enable()
    if (options?.disableFields && form instanceof FormGroup) {
      options.disableFields.forEach((fieldName) => {
        form.controls[fieldName].disable()
      })
    }
  } else if (!enabled && (form.enabled || force)) {
    form.disable()
  }
}

export function updateFormTreeValueAndValidity(
  abstractControl: AbstractControl
): void {
  if (
    abstractControl instanceof FormGroup ||
    abstractControl instanceof FormArray
  ) {
    Object.keys(abstractControl.controls).forEach((key: string) => {
      const descendant = getValueOrError(abstractControl.get(key))
      updateFormTreeValueAndValidity(descendant)
    })
  } else {
    abstractControl.markAsDirty()
    abstractControl.updateValueAndValidity({ onlySelf: true })
  }
}

export function hasAnyRequiredErrors(
  abstractControl: AbstractControl,
  requiredError = 'required'
): boolean {
  if (
    abstractControl instanceof FormGroup ||
    abstractControl instanceof FormArray
  ) {
    return Object.keys(abstractControl.controls).some((key: string) => {
      const descendant = getValueOrError(abstractControl.get(key))
      return hasAnyRequiredErrors(descendant)
    })
  } else {
    return abstractControl.hasError(requiredError)
  }
}

export enum FormValidationResult {
  MISSING_REQUIRED,
  INVALID,
  VALID
}

export function validateForm(form: AbstractControl): FormValidationResult {
  form.markAllAsTouched()
  updateFormTreeValueAndValidity(form)
  if (form.valid) {
    return FormValidationResult.VALID
  }
  if (hasAnyRequiredErrors(form)) {
    return FormValidationResult.MISSING_REQUIRED
  }
  return FormValidationResult.INVALID
}

export function validateFormWithException(
  form: AbstractControl,
  error = 'errors.forms.invalid'
): void {
  const validationResult = validateForm(form)
  if (validationResult !== FormValidationResult.VALID) {
    throw new AppException(error)
  }
}
