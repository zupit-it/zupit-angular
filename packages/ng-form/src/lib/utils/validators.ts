import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";

export class AppValidators {
  static readonly passwordValidators = [
    Validators.required,
    Validators.pattern(
      /^((?=\S*?[A-Za-z])(?=\S*?[0-9$-/:-?{-~!"^_`£#€@]).{0,})\S$/
    ),
  ];

  static matchPassword(
    firstInputName: string,
    secondInputName: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(firstInputName)?.value;
      const confirm = control.get(secondInputName)?.value;

      if (password && confirm && password !== confirm) {
        const confirmControl = control.get(secondInputName);
        const errors = { noMatch: true };
        confirmControl?.setErrors(errors);

        return errors;
      }

      return null;
    };
  }

  static notBlank(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const text = control.value?.toString() ?? "";
      if (text.length === 0) {
        return { blank: true };
      }

      return text.trim() === "" ? { blank: true } : null;
    };
  }

  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const emailError = Validators.email(control);
      if (emailError === null) {
        const patternValidatorFn = Validators.pattern(/.*@.*\..*/);
        const patternError = patternValidatorFn(control);
        if (patternError) {
          return { email: true };
        }
        return null;
      }
      return emailError;
    };
  }

  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const patternValidatorFn = Validators.pattern("\\+?1?\\d{9,15}");
      const patternError = patternValidatorFn(control);
      return patternError ? { phoneNumber: true } : null;
    };
  }

  static maxDate(maxDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value > maxDate) {
        return { maxDate };
      }

      return null;
    };
  }

  static minDate(minDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value < minDate) {
        return { minDate };
      }

      return null;
    };
  }

  static startDateBeforeOrEqualEndDate(
    startDateInputName: string,
    endDateInputName: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDateValue = control.get(startDateInputName)?.value;
      const endDateValue = control.get(endDateInputName)?.value;

      if (!startDateValue || !endDateValue) {
        return null;
      }

      const startDate = new Date(startDateValue);
      const endDate = new Date(endDateValue);

      if (startDate.getTime() > endDate.getTime()) {
        return { startDateAfterEndDate: true };
      }

      return null;
    };
  }
}
