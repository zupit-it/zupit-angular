import {AuthUserPredicateGuard} from './auth-user-predicate.guard'
import {ActivatedRouteSnapshot, Route, RouterStateSnapshot, UrlTree} from '@angular/router'
import {EMPTY, Observable, of} from 'rxjs'
import {AuthenticationService} from '../services/authentication.service'
import {catchError} from 'rxjs/operators'
import {AuthUserPredicates} from '../interfaces'

describe('AuthUserPredicateGuard', () => {
  let guard: AuthUserPredicateGuard

  function fakeRouterState(url: string): RouterStateSnapshot {
    return {
      url
    } as RouterStateSnapshot
  }

  function createRouteSnapshotData(
    predicates?: Partial<AuthUserPredicates>
  ): ActivatedRouteSnapshot {
    const dummyRoute = {
      data: {
        authUserPredicate: predicates
      }
    } as unknown

    return dummyRoute as ActivatedRouteSnapshot
  }

  beforeEach(() => {
    routerSpy = {
      navigate: jest.fn(),
      parseUrl: jest.fn()
    }
    serviceStub = {}
    guard = new AuthUserPredicateGuard(
      serviceStub as AuthenticationService,
      routerSpy
    )
  })

  let routerSpy
  let serviceStub: Partial<AuthenticationService>

  describe('Performs validation checks', () => {
    beforeEach(() => {
      serviceStub.getAuthenticationState = (): Observable<unknown> =>
        of({ username: 'foo' })
    })

    it('throws error if no parameters are specified', (done) => {
      const dummyRoute = createRouteSnapshotData()
      guard
        .canActivate(dummyRoute, fakeRouterState('/test'))
        .pipe(
          catchError((err) => {
            expect(err).toEqual(
              Error('AuthUserPredicate guard missing parameters')
            )
            done()
            return EMPTY
          })
        )
        .subscribe()
    })

    it('throws error if condition is not specified', (done) => {
      const dummyRoute = createRouteSnapshotData({
        attribute: 'hello',
        value: 'bye'
      })

      guard
        .canActivate(
          dummyRoute as ActivatedRouteSnapshot,
          fakeRouterState('/test')
        )
        .pipe(
          catchError((err) => {
            expect(err).toEqual(
              Error('AuthUserPredicate guard missing condition')
            )
            done()
            return EMPTY
          })
        )
        .subscribe()
    })

    it('throws error if attribute is not specified', (done) => {
      const dummyRoute = createRouteSnapshotData({
        condition: 'eq',
        value: 'bye'
      })

      guard
        .canActivate(
          dummyRoute as ActivatedRouteSnapshot,
          fakeRouterState('/test')
        )
        .pipe(
          catchError((err) => {
            expect(err).toEqual(
              Error('AuthUserPredicate guard missing attribute')
            )
            done()
            return EMPTY
          })
        )
        .subscribe()
    })
  })

  describe('Unauthenticated user', () => {
    let dummyRoute: ActivatedRouteSnapshot
    let fakeState: RouterStateSnapshot

    let eventCalled = false

    beforeEach(() => {
      serviceStub.getAuthenticationState = (): Observable<unknown> => of(null)
      dummyRoute = createRouteSnapshotData({
        condition: 'eq',
        value: 'bye',
        attribute: 'foo'
      })
      fakeState = fakeRouterState('/')
      eventCalled = false
      serviceStub.notifyGuardBlockedAccess = (): void => {
        eventCalled = true
        return
      }
    })

    it('Resolves to false', (done) => {
      guard.canActivate(dummyRoute, fakeState).subscribe((result) => {
        expect(result).toBe(false)
        expect(eventCalled).toBe(true)
        done()
      })
    })

    it('Redirects to global redirect route if set', (done) => {
      const dummyUrlTree: UrlTree = new UrlTree()
      const routerParseUrlSpy = jest
        .spyOn(routerSpy, 'parseUrl')
        .mockReturnValue(dummyUrlTree)

      guard = new AuthUserPredicateGuard(
        serviceStub as AuthenticationService,
        routerSpy,
        '/test-error'
      )

      guard.canActivate(dummyRoute, fakeState).subscribe((url) => {
        expect(url).toBeInstanceOf(UrlTree)
        expect(url).toEqual(dummyUrlTree)
        expect(eventCalled).toBe(true)
        expect(routerParseUrlSpy.mock.calls.pop()).toEqual(['/test-error'])
        done()
      })
    })

    it('Redirects to local redirect route if set', (done) => {
      dummyRoute = createRouteSnapshotData({
        condition: 'eq',
        value: 'bye',
        attribute: 'foo',
        redirectRoute: '/local-error'
      })

      const dummyUrlTree: UrlTree = new UrlTree()
      const routerParseUrlSpy = jest
        .spyOn(routerSpy, 'parseUrl')
        .mockReturnValue(dummyUrlTree)

      guard = new AuthUserPredicateGuard(
        serviceStub as AuthenticationService,
        routerSpy
      )

      guard.canActivate(dummyRoute, fakeState).subscribe((url) => {
        expect(url).toBeInstanceOf(UrlTree)
        expect(url).toEqual(dummyUrlTree)
        expect(eventCalled).toBe(true)
        expect(routerParseUrlSpy.mock.calls.pop()).toEqual(['/local-error'])
        done()
      })
    })

    it('Redirects to local redirect route if set and global set too', (done) => {
      dummyRoute = createRouteSnapshotData({
        condition: 'eq',
        value: 'bye',
        attribute: 'foo',
        redirectRoute: '/local-error'
      })

      const dummyUrlTree: UrlTree = new UrlTree()
      const routerParseUrlSpy = jest
        .spyOn(routerSpy, 'parseUrl')
        .mockReturnValue(dummyUrlTree)

      guard = new AuthUserPredicateGuard(
        serviceStub as AuthenticationService,
        routerSpy,
        '/test-error'
      )

      guard.canActivate(dummyRoute, fakeState).subscribe((url) => {
        expect(url).toBeInstanceOf(UrlTree)
        expect(url).toEqual(dummyUrlTree)
        expect(eventCalled).toBe(true)
        expect(routerParseUrlSpy.mock.calls.pop()).toEqual(['/local-error'])
        done()
      })
    })

    it('Does not redirect if global is set but local is false', (done) => {
      dummyRoute = createRouteSnapshotData({
        condition: 'eq',
        value: 'bye',
        attribute: 'foo',
        redirectRoute: false
      })

      const dummyUrlTree: UrlTree = new UrlTree()
      const routerParseUrlSpy = jest
        .spyOn(routerSpy, 'parseUrl')
        .mockReturnValue(dummyUrlTree)
      guard = new AuthUserPredicateGuard(
        serviceStub as AuthenticationService,
        routerSpy,
        '/test-error'
      )

      guard.canActivate(dummyRoute, fakeState).subscribe((resolve) => {
        expect(resolve).toBe(false)
        expect(eventCalled).toBe(true)
        expect(routerParseUrlSpy.mock.calls.length).toEqual(0)
        done()
      })
    })
  })

  describe('Authenticated user', () => {
    const user = {
      username: 'foo',
      email: 'foo@bar.com',
      groups: ['GRP1', 'GRP2']
    }
    let fakeState: RouterStateSnapshot
    let eventCalled = false

    beforeEach(() => {
      serviceStub.getAuthenticationState = (): Observable<unknown> => of(user)
      fakeState = fakeRouterState('/')
      eventCalled = false
      serviceStub.notifyGuardBlockedAccess = (): void => {
        eventCalled = true
        return
      }
    })

    it('Eq value emits true when values are the same', (done) => {
      const route = createRouteSnapshotData({
        condition: 'eq',
        attribute: 'username',
        value: 'foo'
      })
      guard.canActivate(route, fakeState).subscribe((res) => {
        expect(res).toBe(true)
        expect(eventCalled).toBe(false)
        done()
      })
    })

    it('Eq value emits false when values differ', (done) => {
      const route = createRouteSnapshotData({
        condition: 'eq',
        attribute: 'username',
        value: 'bar'
      })
      guard.canActivate(route, fakeState).subscribe((res) => {
        expect(res).toBe(false)
        expect(eventCalled).toBe(true)
        done()
      })
    })

    it('Ne value emits true when values are the same', (done) => {
      const route = createRouteSnapshotData({
        condition: 'ne',
        attribute: 'username',
        value: 'foo'
      })
      guard.canActivate(route, fakeState).subscribe((res) => {
        expect(res).toBe(false)
        expect(eventCalled).toBe(true)
        done()
      })
    })

    it('Ne value emits false when values differ', (done) => {
      const route = createRouteSnapshotData({
        condition: 'ne',
        attribute: 'username',
        value: 'bar'
      })
      guard.canActivate(route, fakeState).subscribe((res) => {
        expect(res).toBe(true)
        expect(eventCalled).toBe(false)
        done()
      })
    })

    it('Any value emits true when at least one value matches', (done) => {
      const route = createRouteSnapshotData({
        condition: 'any',
        attribute: 'groups',
        value: ['GRP1', 'GRP6']
      })
      guard.canActivate(route, fakeState).subscribe((res) => {
        expect(res).toBe(true)
        expect(eventCalled).toBe(false)
        done()
      })
    })

    it('Any value emits false when no value matches', (done) => {
      const route = createRouteSnapshotData({
        condition: 'any',
        attribute: 'groups',
        value: ['GRP5', 'GRP6']
      })
      guard.canActivate(route, fakeState).subscribe((res) => {
        expect(res).toBe(false)
        expect(eventCalled).toBe(true)
        done()
      })
    })

    it('All value emits true when all values matches', (done) => {
      const route = createRouteSnapshotData({
        condition: 'all',
        attribute: 'groups',
        value: ['GRP1', 'GRP2']
      })
      guard.canActivate(route, fakeState).subscribe((res) => {
        expect(res).toBe(true)
        expect(eventCalled).toBe(false)
        done()
      })
    })

    it('All value emits false when not all values match', (done) => {
      const route = createRouteSnapshotData({
        condition: 'all',
        attribute: 'groups',
        value: ['GRP1', 'GRP3']
      })
      guard.canActivate(route, fakeState).subscribe((res) => {
        expect(res).toBe(false)
        expect(eventCalled).toBe(true)
        done()
      })
    })

    it('None value emits true when none of the values match', (done) => {
      const route = createRouteSnapshotData({
        condition: 'none',
        attribute: 'groups',
        value: ['GRP4', 'GRP5']
      })
      guard.canActivate(route, fakeState).subscribe((res) => {
        expect(res).toBe(true)
        expect(eventCalled).toBe(false)
        done()
      })
    })

    it('None value emits false when any values matches', (done) => {
      const route = createRouteSnapshotData({
        condition: 'none',
        attribute: 'groups',
        value: ['GRP1', 'GRP3']
      })
      guard.canActivate(route, fakeState).subscribe((res) => {
        expect(res).toBe(false)
        expect(eventCalled).toBe(true)
        done()
      })
    })

    it('Eq value emits true when can match', (done) => {
      const route = createRouteSnapshotData({
        condition: 'eq',
        attribute: 'username',
        value: 'foo'
      })
      guard.canMatch(route as Route).subscribe((res) => {
        expect(res).toBe(true)
        expect(eventCalled).toBe(false)
        done()
      })
    })
  })
})
