import { TestBed } from '@angular/core/testing'
import { EMPTY, of } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { AUTO_LOGIN, STORAGE_KEY_PREFIX } from '../config'
import { AccessTokenModel } from '../interfaces'
import { AuthenticationProvider } from '../providers/authentication.provider'
import {
  DynamicStorageProvider,
  StorageProvider
} from '../providers/storage.provider'
import { AuthenticationService } from './authentication.service'

describe('AuthenticationServiceWithDynamicStorage', () => {
  let service: AuthenticationService
  let authProvider: AuthenticationProvider
  let storageProvider: DynamicStorageProvider

  const user = { name: 'Foo', surname: 'Bar', email: 'foo@bar.com' }
  const credentials = {
    username: 'user',
    password: 'P@ss'
  }

  beforeEach(() => {
    const authSpy = {
      fetchUser: jest.fn(),
      doLogin: jest.fn(),
      refreshToken: jest.fn()
    }

    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: StorageProvider, useValue: new DynamicStorageProvider() },
        { provide: AuthenticationProvider, useValue: authSpy },
        { provide: AUTO_LOGIN, useValue: true },
        { provide: STORAGE_KEY_PREFIX, useValue: 'ngx-auth-test' }
      ]
    })
    service = TestBed.inject(AuthenticationService)
    authProvider = TestBed.inject(AuthenticationProvider)
    storageProvider = TestBed.inject(StorageProvider) as DynamicStorageProvider
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('initializes the storage provider on login', (done) => {
    const tokenPair: AccessTokenModel = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      dynamicStorage: 'session'
    }

    jest.spyOn(authProvider, 'doLogin').mockReturnValueOnce(of(tokenPair))
    jest.spyOn(authProvider, 'fetchUser').mockReturnValueOnce(of(user))

    service.login(credentials).subscribe(() => {
      expect(storageProvider.getType()).toEqual('session')
      done()
    })
  })

  it('raises error if no dynamic storage is specified', (done) => {
    const tokenPair: AccessTokenModel = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    }

    jest.spyOn(authProvider, 'doLogin').mockReturnValueOnce(of(tokenPair))
    jest.spyOn(authProvider, 'fetchUser').mockReturnValueOnce(of(user))

    service
      .login(credentials)
      .pipe(
        catchError((err) => {
          expect(err).toEqual(
            Error(
              'No storage type specified on login while using a dynamic storage provider'
            )
          )
          done()
          return EMPTY
        })
      )
      .subscribe()
  })
})
