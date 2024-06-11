import { ModuleWithProviders, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  CUSTOM_ICONS_ENUM,
  ICONS_NAMES,
  IconsEnum,
  NgxFantasticonComponent
} from './components/ngx-fantasticon.component'

@NgModule({
  imports: [CommonModule],
  declarations: [NgxFantasticonComponent],
  exports: [NgxFantasticonComponent]
})
export class NgxFantasticonModule {
  static forRoot(icons: IconsEnum): ModuleWithProviders<NgxFantasticonModule> {
    if (!icons) {
      throw new Error(
        'CUSTOM_ICONS_ENUM not provided. Please provide the Icons enum.'
      )
    }

    if (typeof icons !== 'object') {
      throw new Error(
        'CUSTOM_ICONS_ENUM not valid. Please provide a valid Icons enum.'
      )
    }

    const iconsArray = Object.values(icons)
    const iconsNames = new Set<string>(iconsArray)

    return {
      ngModule: NgxFantasticonModule,
      providers: [
        { provide: CUSTOM_ICONS_ENUM, useValue: icons },
        { provide: ICONS_NAMES, useValue: iconsNames }
      ]
    }
  }
}
