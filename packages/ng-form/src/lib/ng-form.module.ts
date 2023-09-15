import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormComponent } from './components/form/form.component'
import { ReactiveFormsModule } from '@angular/forms'
import { SubmitDirective } from './directives/submit.directive'

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [FormComponent, SubmitDirective]
})
export class NgFormModule {}
