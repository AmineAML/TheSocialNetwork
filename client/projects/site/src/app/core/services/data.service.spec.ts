import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { fakeAsync, TestBed, tick } from '@angular/core/testing'
import { Interest, InterestData } from '../../shared/models'
import { DataService } from './data.service'

describe('ReeService', () => {
    let service: DataService
    let httpTestingController: HttpTestingController

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DataService]
        })
        service = TestBed.inject(DataService)
        httpTestingController = TestBed.inject(HttpTestingController)
    })

    afterEach(() => {
        httpTestingController.verify()
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })

    it('listing hobbies should return InterestData', fakeAsync(() => {
        let response: InterestData = {
            message: 'Ree',
            data: {
                interests: [
                    {
                        name: 'drawing',
                        byNumberOfUsers: 10,
                        id: 'dqjskdjqskd',
                        createdAt: new Date('10/10/2018'),
                        updatedAt: new Date('10/10/2018')
                    },
                    {
                        name: 'hiking',
                        byNumberOfUsers: 10,
                        id: 'dqjskdjqskd',
                        createdAt: new Date('10/10/2018'),
                        updatedAt: new Date('10/10/2018')
                    },
                    {
                        name: 'coding',
                        byNumberOfUsers: 10,
                        id: 'dqjskdjqskd',
                        createdAt: new Date('10/10/2018'),
                        updatedAt: new Date('10/10/2018')
                    }
                ]
            },
            errors: null
        }

        service.findAllInterestsSorted().subscribe(interests => {
            response = interests
        })

        const req = httpTestingController.expectOne('/api/v1/users/interests')

        expect(req.request.method).toEqual('GET')

        req.flush(response)

        tick()

        expect(response.data.interests[0].name).toEqual('drawing')
    }))
})
