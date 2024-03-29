import { Injectable, OnDestroy } from '@angular/core'
import { AuthenticationService } from './authentication.service'
import { Observable, Subscription } from 'rxjs'
import { AuthenticationEvent, AuthUserSnapshot, UserType } from '../interfaces'

@Injectable({
  providedIn: 'root'
})
export class NgxAuthService implements OnDestroy {
  private userSnapshot: AuthUserSnapshot = {
    authenticated: false,
    user: null
  }
  private authStateSub?: Subscription

  /**
   * Emits the authentication state, which can be either:
   * - null if user is not authenticated
   * - An object representing the user instance if authenticated
   */
  public get state(): Observable<UserType> {
    return this.libAuthService.getAuthenticationState()
  }

  /**
   * Emits authentication events. Events can be:
   * - initialized: The NgxAuthService has been initialized
   * - login: The user logged in
   * - logout: The user logged out
   * - login-failed: A wrong login attempt was made
   * - session-expired: The authenticated user session expired
   */
  public get events(): Observable<AuthenticationEvent> {
    return this.libAuthService.getAuthenticationEvents()
  }

  /**
   * Returns the current authentication state snapshot, which can be used synchronously.
   */
  public get snapshot(): AuthUserSnapshot {
    return this.userSnapshot
  }

  constructor(private libAuthService: AuthenticationService) {}

  /**
   * Initializes the NgxAuthenticationService.
   * If configured and any authentication tokens are found it the storage, attempts auto-login.
   */
  public initialize(): Observable<UserType> {
    this.authStateSub = this.libAuthService
      .getAuthenticationState()
      .subscribe((user) => {
        this.userSnapshot = {
          authenticated: user != null,
          user: user
        }
      })

    return this.libAuthService.initialize()
  }

  /**
   * Refreshes the authenticated user object instance and emits it.
   *
   * For example, this can be used for refreshing the user
   * instance when his profile is updated and some attributes
   * require to be updated
   */
  public refreshUser(): Observable<UserType> {
    return this.libAuthService.getAuthenticatedUser(true)
  }

  /**
   * Attempts to login the user with the given credentials
   *
   * @param credentials: The credentials required by your authentication implementation
   */
  public login<K>(credentials: K): Observable<UserType> {
    return this.libAuthService.login(credentials)
  }

  /**
   * Logs the user out. Clears the authentication state and all associated storage data
   */
  public logout(): void {
    this.libAuthService.logout()
  }

  /**
   * Login by having a token, most likely from a OAuth2 provider,
   * that does not require the user to login with standard credentials
   * @param token: The authentication token
   * @param refreshTOken: The refresh token if any
   */
  public tokenLogin(
    token: string,
    refreshToken?: string
  ): Observable<UserType> {
    return this.libAuthService.tokenLogin(token, refreshToken)
  }

  /**
   * Retrieve the authentication token
   */
  public getAccessToken(): string | null {
    return this.libAuthService.getAccessToken()
  }

  ngOnDestroy(): void {
    this.authStateSub?.unsubscribe()
  }
}
