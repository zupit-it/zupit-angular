import { TestBed } from '@angular/core/testing'

import { UserResolver } from './user.resolver'
import { AuthenticationService } from '../services/authentication.service'
import { BehaviorSubject } from 'rxjs'
import { UserType } from '../interfaces'

describe('UserResolver', () => {
  let resolver: UserResolver
  let authService: AuthenticationService

  beforeEach(() => {
    const authSpy = {
      getAuthenticationState: jest.fn()
    }

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthenticationService,
          useValue: authSpy
        }
      ]
    })
    resolver = TestBed.inject(UserResolver)
    authService = TestBed.inject(AuthenticationService)
  })

  it('should be created', () => {
    expect(resolver).toBeTruthy()
  })

  it('resolves authenticated user', (done) => {
    const user = { user: 'username' }
    const authState$ = new BehaviorSubject<UserType>(user)

    const getAuthenticationStateSpy = jest
      .spyOn(authService, 'getAuthenticationState')
      .mockReturnValue(authState$.asObservable())

    const result$ = resolver.resolve()

    expect(getAuthenticationStateSpy.mock.calls.length).toEqual(1)

    result$.subscribe((value) => {
      expect(value).toEqual(user)
      done()
    })
  })
})
