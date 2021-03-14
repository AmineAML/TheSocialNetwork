import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MaterialModule } from '../../shared/material.module'
import { LandingComponent } from './landing.component'

describe('LandingComponent', () => {
    let component: LandingComponent
    let fixture: ComponentFixture<LandingComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LandingComponent],
            imports: [RouterTestingModule, MaterialModule, HttpClientTestingModule]
        }).compileComponents()
    })

    beforeEach(async () => {
        fixture = TestBed.createComponent(LandingComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create the app', () => {
        expect(component).toBeTruthy()
    })
})
