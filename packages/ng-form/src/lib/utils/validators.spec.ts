import {FormBuilder, Validators} from "@angular/forms";
import {AppValidators} from "./validators";

describe('Form Validators', () => {
  const fb = new FormBuilder();

  it('passwordValidators should validate required and strong password', () => {
    const formControl = fb.control(undefined, AppValidators.passwordValidators);
    expect(formControl.valid).toBeFalsy();

    formControl.setValue('12345678');
    expect(formControl.valid).toBeFalsy();

    formControl.setValue('password');
    expect(formControl.valid).toBeFalsy();

    formControl.setValue('password123');
    expect(formControl.valid).toBeTruthy();

    formControl.setValue('password#');
    expect(formControl.valid).toBeTruthy();

    formControl.setValue('PASSWORD123');
    expect(formControl.valid).toBeTruthy();

    formControl.setValue('PASSWORD#');
    expect(formControl.valid).toBeTruthy();

    formControl.setValue('PASSWORD123#');
    expect(formControl.valid).toBeTruthy();

    formControl.setValue('Pass0word#');
    expect(formControl.valid).toBeTruthy();
  })

  it('matchPassword should validate that 2 password fields are equals', () => {
    const form = fb.group(
        {
            password1: fb.control('', AppValidators.passwordValidators),
            password2: fb.control('', [Validators.required]),
        },
        {
            validators: AppValidators.matchPassword('password1', 'password2'),
        }
    );

    expect(form.valid).toBeFalsy();

    form.setValue({password1: "Pass0word#", password2: ""});
    expect(form.valid).toBeFalsy();

    form.setValue({password1: "", password2: "Pass0word#"});
    expect(form.valid).toBeFalsy();

    form.setValue({password1: "Pass0word#", password2: "Pass1word#"});
    expect(form.valid).toBeFalsy();

    form.setValue({password1: "Pass0word#", password2: "Pass0word#"});
    expect(form.valid).toBeTruthy();
  })

  it('notBlank should validate a string to be not empty', () => {
    const formControl = fb.control(undefined, [AppValidators.notBlank()]);
    expect(formControl.valid).toBeFalsy();

    formControl.setValue('');
    expect(formControl.valid).toBeFalsy();

    formControl.setValue('   ');
    expect(formControl.valid).toBeFalsy();

    formControl.setValue('something');
    expect(formControl.valid).toBeTruthy();
  })

  it('email should validate that a mail is valid', () => {
    const formControl = fb.control('email', AppValidators.email());

    expect(formControl.valid).toBeFalsy();

    formControl.setValue('email@something');
    expect(formControl.valid).toBeFalsy();

    formControl.setValue('email@something.tld');
    expect(formControl.valid).toBeTruthy();
  })

  it('phoneNumber should validate that the phone number is valid', () => {
    const formControl = fb.control('123', AppValidators.phoneNumber());

    expect(formControl.valid).toBeFalsy();

    formControl.setValue('+39123');
    expect(formControl.valid).toBeFalsy();

    formControl.setValue('+39123123123123123123123123132');
    expect(formControl.valid).toBeFalsy();

    formControl.setValue('+391231231231');
    expect(formControl.valid).toBeTruthy();
  })

  it('maxDate should validate that input date is not after maxDate', () => {
    const formControl = fb.control(new Date('2019-01-01'), AppValidators.maxDate(new Date('2020-01-01')));

    expect(formControl.valid).toBeTruthy();

    formControl.setValue(new Date('2020-01-01'));
    expect(formControl.valid).toBeTruthy();

    formControl.setValue(new Date('2020-01-02'));
    expect(formControl.valid).toBeFalsy();
  })

  it('minDate should validate that input date is not before minDate', () => {
    const formControl = fb.control(new Date('2020-01-02'), AppValidators.minDate(new Date('2020-01-01')));

    expect(formControl.valid).toBeTruthy();

    formControl.setValue(new Date('2020-01-01'));
    expect(formControl.valid).toBeTruthy();

    formControl.setValue(new Date('2019-01-01'));
    expect(formControl.valid).toBeFalsy();
  })

  it('startDateBeforeEndDate should validate that start date is not after end date', () => {
    const form = fb.group(
        {
            startDate: fb.control(new Date('2019-01-01')),
            endDate: fb.control(new Date('2020-01-01')),
        },
        {
            validators: AppValidators.startDateBeforeEndDate('startDate', 'endDate'),
        }
    );

    expect(form.valid).toBeTruthy();

    form.setValue({startDate: new Date('2020-01-01'), endDate: new Date('2020-01-01')});
    expect(form.valid).toBeTruthy();

    form.setValue({startDate: new Date('2021-01-01'), endDate: new Date('2020-01-01')});
    expect(form.valid).toBeFalsy();
  })
})
