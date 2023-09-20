# ng-form

An Angular library to ease the management of Angular Forms.

**What does it provide?**

- Form wrapper to handle enabling/disabling of the form, form submit only when form is valid, etc.
- Useful form validators.
- Useful form utilities.
- Form directive to attach to form tag to handle form submit only when data is valid.

**Is it ready to use?**

The library is in an early development stage,
but is well-tested and all implemented features work.

_Please keep in mind that it might still change a lot._

Feel free to try it out and suggest a feature or contribute yourself if you feel that something is wrong or missing.

## Installation

```shell
npm install -D @zupit-it/ng-form
```

## Docs

### Components

#### FormComponent

The `FormComponent` is a wrapper that substitute the <form> tag in your templates for a better form management.
It allows you to enable or disable the form from its inputs, to keep some fields disabled such as read only fields and to submit the form only when the data is valid.

##### _Inputs_

- `form!: FormGroup`
  The FormGroup control that contains all form data.

- `formDataLoaded?: boolean`
  A flag to know whether all async data necessary to the form were correctly downloaded or not. The form remain disabled until all necessary data is downloaded.

- `enabled = false`
  A flag to specify whether the form should be enabled or not. It depends also on formDataLoaded flag, if it is false the form will be disabled even if enabled is true.

- `disabledFields: string[] = []`
  Allows to keep some fields disabled when the form is enabled. This allows to handle read only fields.

- `forceEnabling = false`
  Force the enabling of the form even if the form is enabled. Might be useful if the form is always enabled but at some point you need to disable some fields.

- `footerStyleClass = ''`
  CSS classes to apply to the footer of the component.

- `contentStyleClass = ''`
  CSS classes to apply to the content section of the component.

- `formStyleClass = ''`
  CSS classes to apply to the form section of the component.

- `showFooter = true`
  Whether to show or not the footer.

- `modelToFormValueMapper: (instance: Model) => unknown `
  A function which maps the instance model to the form value. This is useful when the form value is different from the instance model.

- `formValueToModelMapper: (formValue: unknown) => Model`
  A function which maps the form value to the instance model. This is useful when the form value is different from the instance model.

- `instance: Model | undefined`
  The instance model of the form. It is used to initialize the form value and to map the form value to the instance model.

##### _Outputs_

- `formSubmit = new EventEmitter<Model>()`
  Emit the data when the form is submitted and valid. The emitted data follows the structure of the instance model, which might differ from the form data.

##### _Methods_

- `submittable(): boolean`
  Returns whether the form is valid or not.

- `pristine(): boolean`
  Returns whether the form is pristine or not.

### Directives

#### FormSubmitDirective

The `FormSubmitDirective` is a directive which handles the form submit of a form.
It is useful when you want to handle the form submit only when the form is valid.

##### _Inputs_

- `form!: FormGroup`
  The FormGroup control that contains all form data. Required to know whether the data is valid or not.

##### _Outputs_

- `ngFormSubmit = new EventEmitter<Event>()`
  Emit the data when the form is submitted and valid. If data is not valid, a FormException error is thrown.

### Validators

Set of useful validators to validate common fields, like password, email, phone number, etc.

#### passwordValidators

Field validators to check that the password is required and that the password is strong enough.

#### matchPassword

Form validator to check that two password fields match.

#### notBlank

Field validator to check that the field is not null and not empty.

#### email

Field validator to check that the field is a valid email.

#### phoneNumber

Field validator to check that the field is a valid phone number.

#### maxDate

Field validator to check that the field is before a max date.

#### minDate

Field validator to check that the field is after a min date.

#### startDateBeforeOrEqualEndDate

Form validator to check that the start date is before or equal to the end date.

### Form Utilities

Set of utilities to handle forms.

#### setFormEnabled

Utility to enable or disable a form. It allows to keep some fields disabled when the form is enabled.
This utility does nothing if the form is already in the desired state, except if the flag force is true.

#### updateFormTreeValueAndValidity

Allows to update the value and validity of a form and all its children.
The standard method updateValueAndValidity available in the AbstractControl class updates only its own value and validity.

#### hasAnyRequiredErrors

Utility to check whether a form has any required errors or not.

#### validateForm

Utility that checks whether the form is valid, there are missing required fields or is invalid. It marks the form as touched.

#### validateFormWithException

Utility that throws a FormException if the form is invalid or there are missing required fields. It marks the form as touched.

## Development & Contribution

Setup the project:

```shell
   npm install
   npm run prepare
```

If you want to contribute, please contact open an issue so we can discuss about it.
Then simply do your modifications, add tests to them, and simply submit a change request.

### IDEAS & TODOs:

- Add registration mechanism for common roles checking to improve re-usability
- Centralize events in a service that can be subscribed (on login, on logout, on auth expired, ...)
