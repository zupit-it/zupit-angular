import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'

import { FormComponent } from './components/form/form.component'
import { SubmitDirective } from './directives/submit.directive'

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [FormComponent, SubmitDirective]
})
export class NgFormModule {}
