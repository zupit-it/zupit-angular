import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgFantasticonComponent } from './components/ng-fantasticon.component'

@NgModule({
  imports: [CommonModule],
  declarations: [NgFantasticonComponent],
  exports: [NgFantasticonComponent]
})
export class NgFantasticonModule {}
