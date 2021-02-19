import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DataService } from '../../core/services/data.service';
import { InterestData } from '../../shared/types';

export interface Interest {
  name: string;
}

@Component({
  selector: 'app-interest-list',
  templateUrl: './interest-list.component.html',
  styleUrls: ['./interest-list.component.scss']
})
export class InterestListComponent implements OnInit, OnDestroy {
  //Handle unsubscriptions
  private ngUnsubscribe = new Subject()

  interests: Interest[] = [];

  isServerRespondedWithData: Promise<boolean>

  constructor(private dataService: DataService) { }

  async getInterests() {
    this.dataService.findAllInterestsSorted().pipe(
      //Display data into console log
      // tap(interests => console.log(interests)),
      map((interestData: InterestData) => {
        //this.dataSource = interestData

        interestData.data.interests.forEach(interest => {
          this.interests.push(
            { name: interest.name }
          )
        })

        this.isServerRespondedWithData = Promise.resolve(true)
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()
  }

  async ngOnInit(): Promise<void> {
    await this.getInterests()
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()

    this.ngUnsubscribe.complete()
  }
}
