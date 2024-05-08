import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { FormGroup } from "@angular/forms";

import { setFormEnabled } from "../../utils/form";

@Component({
  selector: "ng-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent<Model> implements OnChanges {
  @Output() formSubmit = new EventEmitter<Model>();

  @Input() form!: FormGroup;
  @Input() formDataLoaded?: boolean;
  @Input() enabled = false;

  @Input() disabledFields: string[] = [];

  @Input() forceEnabling = false;

  @Input() footerStyleClass = "";
  @Input() contentStyleClass = "";
  @Input() formStyleClass = "";

  @Input() showFooter = true;

  @Input() modelToFormValueMapper: (instance: Model) => unknown = (
    instance: Model
  ) => instance;
  @Input() formValueToModelMapper: (formValue: unknown) => Model = (
    formValue: unknown
  ) => formValue as Model;

  @Input() set instance(instance: Model | undefined) {
    this._instance = instance;
    this.reset();
  }
  get instance(): Model | undefined {
    return this._instance;
  }

  public get submittable(): boolean {
    return this.form.valid;
  }

  public get pristine(): boolean {
    return this.form.pristine;
  }

  private _instance?: Model;

  submitFormSave(): void {
    const formValue = this.getValue();
    this.formSubmit.emit(formValue);
  }

  getValue(): Model {
    return this.formValueToModelMapper(this.form.getRawValue());
  }

  ngOnChanges(): void {
    setFormEnabled(this.form, this.enabled && !!this.formDataLoaded, {
      disableFields: this.disabledFields,
      force: this.forceEnabling,
    });
  }

  reset(): void {
    if (this._instance) {
      const formValue = this.modelToFormValueMapper(this._instance);
      this.form.reset(formValue);
    } else {
      this.form.reset();
    }
  }
}
