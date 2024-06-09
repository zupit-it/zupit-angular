import { Component, Inject, InjectionToken, Input } from '@angular/core'

export interface IconsEnum {
  [key: string]: string
}

export const CUSTOM_ICONS_ENUM = new InjectionToken<IconsEnum>(
  'CUSTOM_ICONS_ENUM'
)

export const ICONS_NAMES = new InjectionToken<Set<string>>(
  'ICONS_NAMES_PRIVATE'
)

@Component({
  selector: 'ngx-fantasticon',
  templateUrl: './ngx-fantasticon.component.html',
  styleUrls: ['./ngx-fantasticon.component.scss']
})
export class NgxFantasticonComponent {
  private _icon: string

  @Input() set icon(value: string) {
    if (!this.validateIcon(value)) {
      throw new Error(`Invalid icon '${value}' provided.`)
    }
    this._icon = value
  }

  get icon(): string {
    return this._icon
  }

  constructor(@Inject(ICONS_NAMES) private iconsNames: Set<string>) {}

  private validateIcon(icon: string): boolean {
    return this.iconsNames.has(icon)
  }
}
