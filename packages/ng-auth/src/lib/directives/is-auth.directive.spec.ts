import { Component, NO_ERRORS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AuthenticationService } from '../services/authentication.service'
import { BehaviorSubject } from 'rxjs'
import { IsAuthDirective } from './is-auth.directive'
import { UserType } from '../interfaces'
import { NgxAuthService } from '../services/ngx-auth.service'

@Component({
  template: `
    <div id="auth" *ngAuth>Auth</div>
    <div id="anon" *ngAuth="false">Anon</div>
    <div id="authCtx" *ngAuth="true; user as u">{{ u.username }}</div>
  `
})
export class TestComponent {}

describe('IsAuthDirective', () => {
  let fixture: ComponentFixture<TestComponent>
  let authService: AuthenticationService

  // TODO: Move to utils
  function mockAuthState(user: UserType): void {
    const authState = new BehaviorSubject<UserType>(user)
    jest
      .spyOn(authService, 'getAuthenticationState')
      .mockReturnValue(authState.asObservable())
    fixture.detectChanges()
  }

  beforeEach(() => {
    const authSpy = {
      getAuthenticationState: jest.fn()
    }

    fixture = TestBed.configureTestingModule({
      providers: [
        { provide: AuthenticationService, useValue: authSpy },
        NgxAuthService
      ],
      declarations: [TestComponent, IsAuthDirective],
      schemas: [NO_ERRORS_SCHEMA]
    }).createComponent(TestComponent)

    authService = TestBed.inject(AuthenticationService)
    TestBed.inject(NgxAuthService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('shows contents if user is authenticated', () => {
    const user = { user: 'username' }
    mockAuthState(user)

    const div: HTMLElement = fixture.nativeElement.querySelector('#auth')
    const contents = div.textContent
    expect(contents).toBe('Auth')
  })

  it('hides contents if user is not authenticated', () => {
    mockAuthState(null)

    const div: HTMLElement = fixture.nativeElement.querySelector('#auth')
    expect(div).toBeNull()
  })

  it('shows contents when user is not authenticated', () => {
    mockAuthState(null)

    const div: HTMLElement = fixture.nativeElement.querySelector('#anon')
    const contents = div.textContent
    expect(contents).toBe('Anon')
  })

  it('hides contents when user is authenticated', () => {
    const user = { user: 'username' }
    mockAuthState(user)

    const div: HTMLElement = fixture.nativeElement.querySelector('#anon')
    expect(div).toBeNull()
  })

  it('user is correctly passed in directive context', () => {
    const user = { username: 'username' }
    mockAuthState(user)

    const div: HTMLElement = fixture.nativeElement.querySelector('#authCtx')
    const contents = div.textContent
    expect(contents).toBe(user.username)
  })
})
