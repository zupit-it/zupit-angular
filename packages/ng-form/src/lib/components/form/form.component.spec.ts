import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormComponent } from './form.component'

describe('FormComponent', () => {
  class FakeModel {
    id: string
  }

  let component: FormComponent<FakeModel>
  let fixture: ComponentFixture<FormComponent<FakeModel>>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent<FakeModel>]
    }).compileComponents()

    fixture = TestBed.createComponent(FormComponent<FakeModel>)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
