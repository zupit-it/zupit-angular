import {
  Directive,
  Input,
  OnChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core'
import { AuthConditionalDirective } from './auth-conditional.directive'
import { UserType } from '../interfaces'
import { NgxAuthService } from '../services/ngx-auth.service'

@Directive({
  selector: '[ngAuth]'
})
export class IsAuthDirective
  extends AuthConditionalDirective
  implements OnChanges
{
  @Input()
  ngAuth = true

  @Input()
  ngAuthElse?: TemplateRef<unknown>

  constructor(
    authenticationService: NgxAuthService,
    templateRef: TemplateRef<unknown>,
    viewContainer: ViewContainerRef
  ) {
    super(authenticationService, templateRef, viewContainer)
  }

  shouldShow(user: UserType): boolean {
    return !!user === this.ngAuth
  }

  protected getElseTemplateRef(): TemplateRef<unknown> | undefined {
    return this.ngAuthElse
  }

  ngOnChanges(): void {
    this.updateView()
  }
}
