import { Directive, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'

import { UserType } from '../interfaces'
import { AuthenticationService } from '../services/authentication.service'

@Directive({
  selector: '[ngAuthUser]',
  exportAs: 'userRef'
})
export class UserDirective implements OnInit, OnDestroy {
  private authSub?: Subscription

  private authUser: UserType = null

  public get user(): UserType {
    return this.authUser
  }

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.authSub = this.authenticationService
      .getAuthenticationState()
      .subscribe((user) => {
        this.authUser = user
      })
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe()
    }
  }
}
