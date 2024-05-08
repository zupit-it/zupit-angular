import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";

import { UserType } from "../interfaces";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: "root",
})
export class UserResolver {
  constructor(private authenticationService: AuthenticationService) {}

  resolve(): Observable<UserType> {
    return this.authenticationService.getAuthenticationState().pipe(take(1));
  }
}
