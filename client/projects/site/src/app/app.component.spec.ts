import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { AppComponent } from './app.component'

describe('AppComponent', () => {
    let component: AppComponent
    let fixture: ComponentFixture<AppComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [AppComponent]
        }).compileComponents()
    })

    beforeEach(async () => {
        fixture = TestBed.createComponent(AppComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create the app', () => {
        expect(component).toBeTruthy()
    })

    it(`should display the warning bar for not confirmed email set to true 'true'`, () => {
        expect(component.emailNotConfirmedComponentRemove).toEqual(true)
    })

    xit('should render title', () => {
        fixture.detectChanges()
        const compiled = fixture.nativeElement
        expect(compiled.querySelector('.content span').textContent).toContain(
            'site app is running!'
        )
    })
})
