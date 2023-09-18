import { SubmitDirective } from './submit.directive'
import { FormBuilder, Validators } from '@angular/forms'

describe('SubmitDirective', () => {
  const fb: FormBuilder = new FormBuilder()

  it('ngFormSubmit should emit a submit event when form is valid', () => {
    const directive = new SubmitDirective()
    directive.form = fb.control(123, [Validators.required])

    jest.spyOn(directive.ngFormSubmit, 'emit')

    directive.onSubmit(new Event('submit'))
    expect(directive.ngFormSubmit.emit).toHaveBeenCalled()
  })

  it('ngFormSubmit should raise an error on submit if form is invalid', () => {
    const directive = new SubmitDirective()
    directive.form = fb.control(undefined, [Validators.required])

    jest.spyOn(directive.ngFormSubmit, 'emit')

    expect(() => directive.onSubmit(new Event('submit'))).toThrowError()
    expect(directive.ngFormSubmit.emit).not.toHaveBeenCalled()
  })
})
