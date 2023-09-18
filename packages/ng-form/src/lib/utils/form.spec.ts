import {FormBuilder, Validators} from "@angular/forms";
import {
  FormValidationResult,
  hasAnyRequiredErrors,
  setFormEnabled,
  updateFormTreeValueAndValidity,
  validateForm, validateFormWithException
} from "@zupit-it/ng-form";

describe('Form Utilities', () => {
  const fb = new FormBuilder();

  it('setFormEnabled should enable and disable form', () => {
    const form = fb.group({
        email: fb.control(undefined, [Validators.required]),
        password: fb.control(undefined, [Validators.required])
    });

    setFormEnabled(form, true);
    expect(form.enabled).toBeTruthy();
    setFormEnabled(form, false);
    expect(form.enabled).toBeFalsy();
  })

  it('setFormEnabled should allow to keep some fields disabled when enabling the form', () => {
    const form = fb.group({
        email: fb.control(undefined, [Validators.required]),
        password: fb.control(undefined, [Validators.required])
    });

    setFormEnabled(form, false);
    expect(form.enabled).toBeFalsy();
    setFormEnabled(form, true, {disableFields: ['email']});
    expect(form.enabled).toBeTruthy();
    expect(form.get('email').enabled).toBeFalsy();
    expect(form.get('password').enabled).toBeTruthy();
  })

  it('setFormEnabled should allow to force update the enabled fields', () => {
    const form = fb.group({
        email: fb.control(undefined, [Validators.required]),
        password: fb.control(undefined, [Validators.required])
    });

    setFormEnabled(form, true);
    expect(form.enabled).toBeTruthy();
    expect(form.get('email').enabled).toBeTruthy();
    expect(form.get('password').enabled).toBeTruthy();

    setFormEnabled(form, true, {disableFields: ['email'], force: true});
    expect(form.enabled).toBeTruthy();
    expect(form.get('email').enabled).toBeFalsy();
    expect(form.get('password').enabled).toBeTruthy();
  })

    it('updateFormTreeValueAndValidity should mark the whole form as dirty and update its value and validity', () => {
      const form = fb.group({
          email: fb.control(undefined, [Validators.required]),
          password: fb.control(undefined, [Validators.required])
      });

      form.setValue({"email": "email", "password": "password"});

      expect(form.dirty).toBeFalsy();

      updateFormTreeValueAndValidity(form);
      expect(form.dirty).toBeTruthy();
      expect(form.get('email').dirty).toBeTruthy();

      expect(form.get('password').dirty).toBeTruthy();
      expect(form.valid).toBeTruthy();
    });

    it('hasAnyRequiredErrors should return true only if the form has any required errors', () => {
      const form = fb.group({
          email: fb.control(undefined, [Validators.required, Validators.maxLength(10)]),
          password: fb.control(undefined, [Validators.required])
      });

      expect(hasAnyRequiredErrors(form)).toBeTruthy();

      form.setValue({"email": "too_long_email_example", "password": "password"});
      expect(hasAnyRequiredErrors(form)).toBeFalsy();

      form.setValue({"email": "email", "password": "password"});
      expect(hasAnyRequiredErrors(form)).toBeFalsy();
    });


    it('validateForm should return correct value based on form validity and required fields', () => {
      const form = fb.group({
          email: fb.control(undefined, [Validators.required, Validators.maxLength(10)]),
          password: fb.control(undefined, [Validators.required])
      });

      expect(validateForm(form)).toBe(FormValidationResult.MISSING_REQUIRED);

      form.setValue({"email": "too_long_email_example", "password": "password"});
      expect(validateForm(form)).toBe(FormValidationResult.INVALID);

      form.setValue({"email": "email", "password": "password"});
      expect(validateForm(form)).toBe(FormValidationResult.VALID);
    });

    it('validateForm should raise exception if the form is not valid', () => {
      const form = fb.group({
          email: fb.control(undefined, [Validators.required, Validators.maxLength(10)]),
          password: fb.control(undefined, [Validators.required])
      });

      expect(() => validateFormWithException(form)).toThrowError();

      form.setValue({"email": "too_long_email_example", "password": "password"});
      expect(() => validateFormWithException(form)).toThrowError();

      form.setValue({"email": "email", "password": "password"});
      expect(() => validateFormWithException(form)).not.toThrowError();
    });
})
