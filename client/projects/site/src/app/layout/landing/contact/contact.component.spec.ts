import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterTestingModule } from '@angular/router/testing'

import { ContactComponent } from './contact.component'

describe('ContactComponent', () => {
    let component: ContactComponent
    let fixture: ComponentFixture<ContactComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ContactComponent],
            imports: [RouterTestingModule, ReactiveFormsModule, FormsModule]
        }).compileComponents()
    })

    beforeEach(async () => {
        fixture = TestBed.createComponent(ContactComponent)
        component = fixture.componentInstance
        spyOn(component.submitEmail, 'emit')
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('form invalid when empty', () => {
        expect(component.contactForm.valid).toBeFalsy()
    })

    it('form valid when values are set', () => {
        component.contactForm.setValue({
            name: 'Roe',
            email: 'roe@email.com',
            subject: 'Inquiries about networking in the platform',
            message:
                'Knowing this is a good initiative to address those who like a different approach in forming new friendship, better ways of networking are highly important to implement'
        })
        expect(component.contactForm.valid).toBeTruthy()
    })

    it('should emit submitEmail event when call send email function', () => {
        component.sendEmail()
        expect(component.submitEmail.emit).toHaveBeenCalledWith(component.contactForm.getRawValue())
    })
})
