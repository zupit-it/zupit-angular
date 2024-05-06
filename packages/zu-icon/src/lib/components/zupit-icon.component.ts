import {Component, Inject, InjectionToken, Input} from '@angular/core';

export interface IconsEnum {
    [key: string]: string;
}

export const CUSTOM_ICONS_ENUM = new InjectionToken<IconsEnum>('CUSTOM_ICONS_ENUM');

@Component({
    selector: 'zu-icon',
    templateUrl: './zupit-icon.component.html',
    styleUrls: ['./zupit-icon.component.scss'],
})
export class ZupitIconComponent {
    @Input() set icon(value: string) {
        if (!this.validateIcon(value)) {
            throw new Error(`Invalid icon '${value}' provided.`);
        }
        this._icon = value;
    }

    get icon(): string {
        return this._icon;
    }

    private _icon: string;

    private validateIcon(icon: string): boolean {
        return Object.values(this.icons).includes(icon);
    }

    constructor(@Inject(CUSTOM_ICONS_ENUM) public icons: IconsEnum) {
        if (!icons) {
            throw new Error('CUSTOM_ICONS_ENUM not provided. Please provide the Icons enum.');
        }

        if(typeof icons !== "object") {
            throw new Error('CUSTOM_ICONS_ENUM not valid. Please provide a valid Icons enum.');
        }
    }
}
