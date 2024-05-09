import {
  Directive,
  Input,
  OnChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core'

import { AuthUserType, Condition, UserType } from '../interfaces'
import { NgxAuthService } from '../services/ngx-auth.service'
import { UserConditions } from '../utils/user-conditions'
import { AuthConditionalDirective } from './auth-conditional.directive'

@Directive({
  selector: '[ngAuthHas]'
})
export class UserHasDirective
  extends AuthConditionalDirective
  implements OnChanges
{
  @Input()
  ngAuthHas = ''

  @Input()
  ngAuthHasAny?: string[]

  @Input()
  ngAuthHasAll?: string[]

  @Input()
  ngAuthHasEq?: string

  @Input()
  ngAuthHasNe?: string

  @Input()
  ngAuthHasNone?: string[]

  @Input()
  ngAuthHasCond = true

  @Input()
  ngAuthHasUserCond?: Condition[]

  @Input()
  ngAuthHasUserCondOp: 'and' | 'or' = 'and'

  @Input()
  ngAuthHasElse?: TemplateRef<unknown>

  constructor(
    authenticationService: NgxAuthService,
    templateRef: TemplateRef<unknown>,
    viewContainer: ViewContainerRef
  ) {
    super(authenticationService, templateRef, viewContainer)
  }

  shouldShow(user: UserType): boolean {
    return (
      user != null &&
      this.checkConditions(user) &&
      this.ngAuthHasCond &&
      this.checkUserConditions(user)
    )
  }

  protected getElseTemplateRef(): TemplateRef<unknown> | undefined {
    return this.ngAuthHasElse
  }

  private checkConditions(user: AuthUserType): boolean {
    const attrValue: unknown = user[this.ngAuthHas]

    if (attrValue === undefined) {
      return false
    }

    if (this.ngAuthHasAny != null) {
      return UserConditions.hasAnyValues(
        attrValue as unknown[],
        this.ngAuthHasAny
      )
    }

    if (this.ngAuthHasAll != null) {
      return UserConditions.hasAllValues(
        attrValue as unknown[],
        this.ngAuthHasAll
      )
    }

    if (this.ngAuthHasNone != null) {
      return UserConditions.hasNoneOfTheValues(
        attrValue as unknown[],
        this.ngAuthHasNone
      )
    }

    if (this.ngAuthHasEq != null) {
      return UserConditions.hasEqValue(attrValue as unknown[], this.ngAuthHasEq)
    }

    if (this.ngAuthHasNe != null) {
      return UserConditions.hasNeValue(attrValue as unknown[], this.ngAuthHasNe)
    }

    throw Error('Use one of the operators: anyIn, allIn, eq')
  }

  ngOnChanges(): void {
    this.updateView()
  }

  private checkUserConditions(user: UserType): boolean {
    if (!this.ngAuthHasUserCond) {
      return true
    }

    return UserConditions.evaluateConditions(
      user,
      this.ngAuthHasUserCondOp,
      this.ngAuthHasUserCond
    )
  }
}
