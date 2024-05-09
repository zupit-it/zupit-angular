import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router'
import { Observable, of } from 'rxjs'

import { AuthenticationService } from '../services/authentication.service'
import { AuthUserGuard } from './auth-user.guard'

describe('AuthUserPredicateGuard', () => {
  let guard: AuthUserGuard
  let router: Router
  const serviceStub: Partial<AuthenticationService> = {}

  describe('Unauthenticated, without redirect', () => {
    let eventCalled = false
    let routerSpy = null

    beforeEach(() => {
      routerSpy = {
        navigate: jest.fn(),
        parseUrl: jest.fn()
      }
      guard = new AuthUserGuard(
        serviceStub as AuthenticationService,
        routerSpy,
        undefined
      )
      serviceStub.getAuthenticationState = (): Observable<any> => of(null)
      eventCalled = false
      serviceStub.notifyGuardBlockedAccess = (): void => {
        eventCalled = true
        return
      }
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('emits false when user is not authenticated', (done) => {
      guard
        .canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
        .subscribe((res: UrlTree | boolean) => {
          expect(res).toBe(false)
          expect(eventCalled).toBe(true)
          done()
        })
    })
  })

  describe('Unauthenticated, with redirect', () => {
    let eventCalled = false
    let routerSpy = null

    beforeEach(() => {
      routerSpy = {
        navigate: jest.fn(),
        parseUrl: jest.fn()
      }
      guard = new AuthUserGuard(
        serviceStub as AuthenticationService,
        routerSpy,
        '/error'
      )
      serviceStub.getAuthenticationState = (): Observable<any> => of(null)
      eventCalled = false
      serviceStub.notifyGuardBlockedAccess = (): void => {
        eventCalled = true
        return
      }
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('redirects to configured URL when user is not authenticated', (done) => {
      const dummyUrlTree: UrlTree = new UrlTree()
      const routerParseUrlSpy = jest
        .spyOn(routerSpy, 'parseUrl')
        .mockReturnValue(dummyUrlTree)

      guard
        .canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
        .subscribe((url: UrlTree | boolean) => {
          expect(url).toBeInstanceOf(UrlTree)
          expect(url).toEqual(dummyUrlTree)
          expect(routerParseUrlSpy.mock.calls.pop()).toEqual(['/error'])
          expect(eventCalled).toBe(true)
          done()
        })
    })
  })

  describe('Authenticated', () => {
    let routerSpy = null

    beforeEach(() => {
      routerSpy = {
        navigate: jest.fn(),
        parseUrl: jest.fn()
      }
      guard = new AuthUserGuard(
        serviceStub as AuthenticationService,
        routerSpy,
        undefined
      )
      serviceStub.getAuthenticationState = (): Observable<any> =>
        of({ username: 'foo' })
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('emits true when user is authenticated', (done) => {
      const dummyUrlTree: UrlTree = new UrlTree()
      jest.spyOn(routerSpy, 'parseUrl').mockReturnValue(dummyUrlTree)

      guard
        .canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
        .subscribe((res: UrlTree | boolean) => {
          expect(res).toBe(true)
          done()
        })
    })

    it('emits true when user is authenticated and can match', (done) => {
      const dummyUrlTree: UrlTree = new UrlTree()
      jest.spyOn(routerSpy, 'parseUrl').mockReturnValue(dummyUrlTree)

      guard.canMatch().subscribe((res: UrlTree | boolean) => {
        expect(res).toBe(true)
        done()
      })
    })
  })
})
