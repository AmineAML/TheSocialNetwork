import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { FeaturesComponent } from './features.component'

describe('FeaturesComponent', () => {
    let component: FeaturesComponent
    let fixture: ComponentFixture<FeaturesComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FeaturesComponent],
            imports: [RouterTestingModule]
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(FeaturesComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
