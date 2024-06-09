import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core'
import { AbstractControl } from '@angular/forms'
import { validateFormWithException } from '../utils/form'

@Directive({
  selector: '[ngFormSubmit]'
})
export class SubmitDirective {
  @Input() form?: AbstractControl
  @Output() readonly ngFormSubmit = new EventEmitter<Event>()

  @HostListener('submit', ['$event']) onSubmit(event: Event): void {
    event.preventDefault()

    if (this.form) {
      validateFormWithException(this.form)
    }

    this.ngFormSubmit.emit(event)
  }
}
