import { Inject, Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { HOME_URL } from "../config";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: "root",
})
export class AnonUserGuard {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    @Inject(HOME_URL) private homeUrl: string
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authenticationService.getAuthenticationState().pipe(
      map((identity) => {
        if (identity != null) {
          this.authenticationService.notifyGuardBlockedAccess(
            "AnonUserGuard",
            route,
            state
          );
          return this.router.parseUrl(this.homeUrl);
        }
        return true;
      })
    );
  }
}
