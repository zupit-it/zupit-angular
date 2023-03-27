import { TestBed } from '@angular/core/testing'
import { EMPTY, of, throwError } from 'rxjs'
import { catchError, concatMap } from 'rxjs/operators'
import { AuthenticationProvider } from '../providers/authentication.provider'
import {
  MemoryStorageProvider,
  StorageProvider
} from '../providers/storage.provider'

import { AuthenticationService } from './authentication.service'
import { AUTO_LOGIN, STORAGE_KEY_PREFIX } from '../config'

describe('AuthenticationService', () => {
  const storagePrefix = 'ngx-auth-test'
  let service: AuthenticationService
  let authProvider: AuthenticationProvider
  let storageProvider: StorageProvider

  beforeEach(() => {
    const authSpy = {
      fetchUser: jest.fn(),
      doLogin: jest.fn(),
      refreshToken: jest.fn()
    }

    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: StorageProvider, useValue: new MemoryStorageProvider() },
        { provide: AuthenticationProvider, useValue: authSpy },
        { provide: AUTO_LOGIN, useValue: true },
        { provide: STORAGE_KEY_PREFIX, useValue: storagePrefix }
      ]
    })
    service = TestBed.inject(AuthenticationService)
    authProvider = TestBed.inject(AuthenticationProvider)
    storageProvider = TestBed.inject(StorageProvider)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should login if credentials are valid', (done) => {
    const user = { name: 'Foo', surname: 'Bar', email: 'foo@bar.com' }
    const credentials = {
      username: 'user',
      password: 'P@ss'
    }
    const tokenPair = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    }

    const doLoginSpy = jest
      .spyOn(authProvider, 'doLogin')
      .mockReturnValueOnce(of(tokenPair))
    const fetchUserSpy = jest
      .spyOn(authProvider, 'fetchUser')
      .mockReturnValueOnce(of(user))

    expect(service.isAuthenticated()).toBeFalsy()

    service.login(credentials).subscribe((user) => {
      expect(user).toEqual(user)

      expect(doLoginSpy.mock.calls.length).toEqual(1)
      expect(doLoginSpy.mock.calls.pop()).toEqual([credentials])

      expect(
        storageProvider.retrieve(
          storagePrefix + '-' + service.AUTH_ACCESS_TOKEN
        )
      ).toEqual(tokenPair.accessToken)
      expect(
        storageProvider.retrieve(
          storagePrefix + '-' + service.AUTH_REFRESH_TOKEN
        )
      ).toEqual(tokenPair.refreshToken)

      expect(fetchUserSpy.mock.calls.length).toEqual(1)

      expect(service.isAuthenticated()).toBeTruthy()
      service.getAuthenticationState().subscribe((auth) => {
        expect(auth).toBeTruthy()
        expect(auth).toEqual(user)
        done()
      })
    })
  })

  it('should not login if credentials are invalid', (done) => {
    const authError = { error: 'an-error' }

    jest
      .spyOn(authProvider, 'doLogin')
      .mockReturnValueOnce(throwError(authError))

    service
      .login({ foo: 'bar' })
      .pipe(
        catchError((err) => {
          expect(err).toEqual(authError)
          expect(service.isAuthenticated()).toBeFalsy()
          done()
          return EMPTY
        })
      )
      .subscribe()
  })

  it('does not authenticate when credentials are valid but user could not be fetched', (done) => {
    const tokenPair = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    }
    const userError = { error: 'an-error' }

    jest.spyOn(authProvider, 'doLogin').mockReturnValueOnce(of(tokenPair))
    jest
      .spyOn(authProvider, 'fetchUser')
      .mockReturnValueOnce(throwError(userError))

    service
      .login({ foo: 'bar' })
      .pipe(
        catchError((err) => {
          expect(err).toEqual(userError)
          expect(service.isAuthenticated()).toBeFalsy()

          expect(
            storageProvider.retrieve(
              storagePrefix + '-' + service.AUTH_ACCESS_TOKEN
            )
          ).toBeUndefined()
          expect(
            storageProvider.retrieve(
              storagePrefix + '-' + service.AUTH_REFRESH_TOKEN
            )
          ).toBeUndefined()
          done()
          return EMPTY
        })
      )
      .subscribe()
  })

  it('caches authenticated user', (done) => {
    const user = { name: 'Foo', surname: 'Bar', email: 'foo@bar.com' }
    const fetchUserSpy = jest
      .spyOn(authProvider, 'fetchUser')
      .mockReturnValueOnce(of(user))

    service
      .getAuthenticatedUser()
      .pipe(concatMap(() => service.getAuthenticatedUser()))
      .subscribe(() => {
        expect(fetchUserSpy.mock.calls.length).toEqual(1)
        done()
      })
  })

  it('ignores authenticated user cache when force=true', (done) => {
    const user = { name: 'Foo', surname: 'Bar', email: 'foo@bar.com' }
    const fetchUserSpy = jest
      .spyOn(authProvider, 'fetchUser')
      .mockReturnValue(of(user))

    service
      .getAuthenticatedUser()
      .pipe(concatMap(() => service.getAuthenticatedUser(true)))
      .subscribe(() => {
        expect(fetchUserSpy.mock.calls.length).toEqual(2)
        done()
      })
  })

  it('initializes requesting authenticated user when access token is present', (done) => {
    const user = { name: 'Foo', surname: 'Bar', email: 'foo@bar.com' }
    const fetchUserSpy = jest
      .spyOn(authProvider, 'fetchUser')
      .mockReturnValueOnce(of(user))

    storageProvider.store(
      storagePrefix + '-' + service.AUTH_IS_AUTHENTICATED,
      JSON.stringify(new Date())
    )
    storageProvider.store(
      storagePrefix + '-' + service.AUTH_ACCESS_TOKEN,
      'valid-access-token'
    )

    service.initialize().subscribe((authUser) => {
      expect(authUser).toEqual(user)

      expect(fetchUserSpy.mock.calls.length).toEqual(1)
      done()
    })
  })

  it('does not authenticate when access token is present but user can not be fetched', (done) => {
    const userError = { error: 'foo' }
    const fetchUserSpy = jest
      .spyOn(authProvider, 'fetchUser')
      .mockReturnValueOnce(throwError(userError))

    storageProvider.store(
      storagePrefix + '-' + service.AUTH_IS_AUTHENTICATED,
      JSON.stringify(new Date())
    )
    storageProvider.store(
      storagePrefix + '-' + service.AUTH_ACCESS_TOKEN,
      'expired-access-token'
    )

    service.initialize().subscribe((authUser) => {
      expect(authUser).toBeFalsy()

      expect(fetchUserSpy.mock.calls.length).toEqual(1)
      done()
    })
  })

  it('does not request authenticated user when access token is not present', (done) => {
    const fetchUserSpy = jest.spyOn(authProvider, 'fetchUser')

    service.initialize().subscribe((authUser) => {
      expect(authUser).toEqual(null)

      expect(fetchUserSpy.mock.calls.length).toEqual(0)
      done()
    })
  })
})
