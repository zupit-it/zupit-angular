import { SubmitDirective } from './submit.directive'
import { Component } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

@Component({
  template: `
    <form id="form" [form]="form" (ngFormSubmit)="onSubmit($event)"></form>
  `
})
export class TestComponent {
  readonly form = this.fb.group({
    id: this.fb.control(undefined, [Validators.required])
  })
  constructor(private fb: FormBuilder) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  onSubmit(event: Event): void {}
}
describe('SubmitDirective', () => {
  let component: TestComponent
  let fixture: ComponentFixture<TestComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TestComponent, SubmitDirective]
    }).compileComponents()
    fixture = TestBed.createComponent(TestComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('ngFormSubmit should emit a submit event when form is valid', () => {
    component.form.setValue({ id: '123' })
    expect(component.form.valid).toBeTruthy()

    const directive = fixture.debugElement
      .query(By.directive(SubmitDirective))
      .injector.get(SubmitDirective)

    jest.spyOn(directive.ngFormSubmit, 'emit')

    directive.onSubmit(new Event('submit'))
    expect(directive.ngFormSubmit.emit).toHaveBeenCalled()
  })

  it('ngFormSubmit should raise an error on submit if form is invalid', () => {
    expect(component.form.valid).toBeFalsy()

    const directive = fixture.debugElement
      .query(By.directive(SubmitDirective))
      .injector.get(SubmitDirective)

    jest.spyOn(directive.ngFormSubmit, 'emit')

    expect(() => directive.onSubmit(new Event('submit'))).toThrowError()
    expect(directive.ngFormSubmit.emit).not.toHaveBeenCalled()
  })
})
