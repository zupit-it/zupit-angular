import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { FormComponent } from "./form.component";

describe("FormComponent", () => {
  const fb: FormBuilder = new FormBuilder();

  class FakeModel {
    email: string;
    password: string;
  }

  let component: FormComponent<FakeModel>;
  let fixture: ComponentFixture<FormComponent<FakeModel>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent<FakeModel>],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent<FakeModel>);
    component = fixture.componentInstance;
  });

  it("submittable should be truthy only if form data is valid", () => {
    component.form = fb.group({
      email: fb.control(undefined, [Validators.required]),
      password: fb.control(undefined, [Validators.required]),
    });
    fixture.detectChanges();

    expect(component.submittable).toBeFalsy();
    component.form.setValue({
      email: "email",
      password: "password",
    });
    expect(component.submittable).toBeTruthy();
  });

  it("pristine should be truthy only if form is pristine", () => {
    component.form = fb.group({
      email: fb.control(undefined, [Validators.required]),
      password: fb.control(undefined, [Validators.required]),
    });
    fixture.detectChanges();

    expect(component.pristine).toBeTruthy();
    component.form.markAsDirty();
    expect(component.pristine).toBeFalsy();
  });

  it("instance update should reset form data", () => {
    component.form = fb.group({
      email: fb.control("email", [Validators.required]),
      password: fb.control("password", [Validators.required]),
    });
    fixture.detectChanges();

    expect(component.form.getRawValue()).toEqual({
      email: "email",
      password: "password",
    });
    component.instance = { email: "email2", password: "password2" };
    expect(component.form.getRawValue()).toEqual({
      email: "email2",
      password: "password2",
    });
  });

  it("formSubmit should emit when submit directive calls submitFormSave", () => {
    component.form = fb.group({
      email: fb.control("email", [Validators.required]),
      password: fb.control("password", [Validators.required]),
    });
    fixture.detectChanges();

    jest.spyOn(component.formSubmit, "emit");

    component.submitFormSave();

    expect(component.formSubmit.emit).toHaveBeenCalledWith({
      email: "email",
      password: "password",
    });
  });

  it("modelToFormValueMapper should transform instance to form data", () => {
    component.form = fb.group({
      username: fb.control(undefined, [Validators.required]),
      password: fb.control(undefined, [Validators.required]),
    });
    component.modelToFormValueMapper = (instance: FakeModel) => ({
      username: instance.email,
      password: instance.password,
    });
    fixture.detectChanges();

    component.instance = { email: "username@email", password: "password" };
    expect(component.form.getRawValue()).toEqual({
      username: "username@email",
      password: "password",
    });
  });

  it("formValueToModelMapper should transform form data to instance", () => {
    component.form = fb.group({
      username: fb.control("username@email", [Validators.required]),
      password: fb.control("password", [Validators.required]),
    });
    component.formValueToModelMapper = (formData: {
      username: string;
      password: string;
    }) => ({ email: formData.username, password: formData.password });
    fixture.detectChanges();

    expect(component.getValue()).toEqual({
      email: "username@email",
      password: "password",
    });
  });

  it("form should be enabled if enabled is true and formDataLoaded is true", () => {
    component.form = fb.group({
      username: fb.control("username@email", [Validators.required]),
      password: fb.control("password", [Validators.required]),
    });
    component.enabled = false;
    component.formDataLoaded = false;
    component.ngOnChanges();

    expect(component.form.enabled).toBeFalsy();

    component.enabled = true;
    component.formDataLoaded = false;
    component.ngOnChanges();

    expect(component.form.enabled).toBeFalsy();

    component.enabled = false;
    component.formDataLoaded = true;
    component.ngOnChanges();

    expect(component.form.enabled).toBeFalsy();

    component.enabled = true;
    component.formDataLoaded = true;
    component.ngOnChanges();

    expect(component.form.enabled).toBeTruthy();
  });

  it("form should allow to keep some fields disabled when enabling the others", () => {
    component.form = fb.group({
      username: fb.control("username@email", [Validators.required]),
      password: fb.control("password", [Validators.required]),
    });
    component.form.disable();
    component.enabled = true;
    component.formDataLoaded = true;
    component.disabledFields = ["username"];
    component.ngOnChanges();

    expect(component.form.enabled).toBeTruthy();
    expect(component.form.get("username").enabled).toBeFalsy();
    expect(component.form.get("password").enabled).toBeTruthy();
  });

  it("form should update enabled field when form is enabled only when forceEnabling is true", () => {
    component.form = fb.group({
      username: fb.control("username@email", [Validators.required]),
      password: fb.control("password", [Validators.required]),
    });

    component.form.enable();
    component.enabled = true;
    component.formDataLoaded = true;
    component.disabledFields = ["username"];
    component.ngOnChanges();

    expect(component.form.enabled).toBeTruthy();
    expect(component.form.get("username").enabled).toBeTruthy();
    expect(component.form.get("password").enabled).toBeTruthy();

    component.forceEnabling = true;
    component.ngOnChanges();

    expect(component.form.enabled).toBeTruthy();
    expect(component.form.get("username").enabled).toBeFalsy();
    expect(component.form.get("password").enabled).toBeTruthy();
  });
});
