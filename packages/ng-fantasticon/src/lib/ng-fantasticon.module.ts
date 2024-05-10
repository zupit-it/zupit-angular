import { CommonModule } from '@angular/common'
import { ModuleWithProviders, NgModule } from '@angular/core'

import {
  CUSTOM_ICONS_ENUM,
  ICONS_NAMES,
  IconsEnum,
  NgFantasticonComponent
} from './components/ng-fantasticon.component'

@NgModule({
  imports: [CommonModule],
  declarations: [NgFantasticonComponent],
  exports: [NgFantasticonComponent]
})
export class NgFantasticonModule {
  static forRoot(icons: IconsEnum): ModuleWithProviders<NgFantasticonModule> {
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
      ngModule: NgFantasticonModule,
      providers: [
        { provide: CUSTOM_ICONS_ENUM, useValue: icons },
        { provide: ICONS_NAMES, useValue: iconsNames }
      ]
    }
  }
}
