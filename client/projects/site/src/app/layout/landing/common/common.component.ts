import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { DataService } from '../../../core/services/data.service';
import { InterestData } from '../../../shared/types';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss']
})
export class CommonComponent implements OnInit, OnDestroy {
  dataSource: InterestData = null

  //Handle unsubscriptions
  private ngUnsubscribe = new Subject()

  isServerRespondedWithData: Promise<boolean>

  async getInterests() {
    this.dataService.findAllInterestsSorted().pipe(
      //Display data into console log
      //tap(interests => console.log(interests)),
      map((interestData: InterestData) => {
        this.dataSource = interestData

        this.isServerRespondedWithData = Promise.resolve(true)
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()
  }

  getUsers(query: string) {
    this.router.navigate(['search'], { queryParams: { interest: query } })
  }

  constructor(private dataService: DataService ,
              private router: Router) { }

  async ngOnInit(): Promise<void> {
    await this.getInterests()
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()

    this.ngUnsubscribe.complete()
  }
}
