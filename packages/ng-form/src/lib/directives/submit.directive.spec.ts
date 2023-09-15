import {SubmitDirective} from './submit.directive'
import {Component} from "@angular/core";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {ComponentFixture, TestBed} from "@angular/core/testing";

@Component({
  template: `
    <form id="form" [form]="form" (ngFormSubmit)="onSubmit($event)">
      <button id="submit" type="submit"></button>
    </form>
  `
})
export class TestComponent {
  readonly form = this.fb.group({
    id: this.fb.control(undefined, [Validators.required]),
  });
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
      declarations: [TestComponent, SubmitDirective],
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('ngFormSubmit should emit a submit event when form is valid', () => {
    component.form.setValue({id: '123'});
    expect(component.form.valid).toBeTruthy();

    jest.spyOn(component, 'onSubmit');
    const submit: HTMLElement = fixture.nativeElement.querySelector('#submit');
    submit.click();
    expect(component.onSubmit).toHaveBeenCalled();
  })

  it('ngFormSubmit should raise an error on submit if form is invalid', () => {
    expect(component.form.valid).toBeFalsy();

    jest.spyOn(component, 'onSubmit');
    const submit: HTMLElement = fixture.nativeElement.querySelector('#submit');
    submit.click()
    //TODO: expect(component.onSubmit).toThrowError();
    expect(component.onSubmit).not.toHaveBeenCalled();
  })
})
