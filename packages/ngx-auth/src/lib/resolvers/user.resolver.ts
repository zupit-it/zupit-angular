import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AuthenticationService } from '../services/authentication.service'
import { take } from 'rxjs/operators'
import { UserType } from '../interfaces'

@Injectable({
  providedIn: 'root'
})
export class UserResolver {
  constructor(private authenticationService: AuthenticationService) {}

  resolve(): Observable<UserType> {
    return this.authenticationService.getAuthenticationState().pipe(take(1))
  }
}
