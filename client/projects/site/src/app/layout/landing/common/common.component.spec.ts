import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { CommonComponent } from './common.component'

describe('CommonComponent', () => {
    let component: CommonComponent
    let fixture: ComponentFixture<CommonComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CommonComponent],
            imports: [RouterTestingModule]
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(CommonComponent)
        component = fixture.componentInstance
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
})
