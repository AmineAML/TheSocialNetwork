import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MaterialModule } from '../../../shared/material.module'

import { HeroComponent } from './hero.component'

describe('HeroComponent', () => {
    let component: HeroComponent
    let fixture: ComponentFixture<HeroComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HeroComponent],
            imports: [MaterialModule, RouterTestingModule]
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(HeroComponent)
        component = fixture.componentInstance
        spyOn(component.getUsers, 'emit')
        component.options = [
            {
                name: 'Drawing'
            },
            {
                name: 'Hiking'
            },
            {
                name: 'Coding'
            }
        ]
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('should have an array of hobbies', () => {
        expect(component.options).toBeDefined()
    })

    it('should not emit submitEmail event when call send email function with undifined value, empty space and null', () => {
        component.searchUsersWithHobby('   ')
        expect(component.getUsers.emit).not.toHaveBeenCalled()
    })

    it('should emit submitEmail event when call send email function', () => {
        component.searchUsersWithHobby(component.options[0].name)
        expect(component.getUsers.emit).toHaveBeenCalledWith(component.options[0].name)
    })
})
