import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { DataService } from '../../../core/services/data.service';
import { InterestData } from '../../../shared/types';

export interface Interest {
  name: string;
}

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, OnDestroy {
  myControl = new FormControl();

  options: Interest[] = [];

  filteredOptions: Observable<Interest[]>;

  dataSource: InterestData = null

  //Handle unsubscriptions
  private ngUnsubscribe = new Subject()

  constructor(private router: Router,
              private dataService: DataService) { }

  async getInterests() {
    this.dataService.findAllInterestsSorted().pipe(
      //Display data into console log
      // tap(interests => console.log(interests)),
      map((interestData: InterestData) => {
        this.dataSource = interestData

        this.dataSource.data.interests.forEach(interest => {
          this.options.push(
            { name: interest.name }
          )
        })
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()
  }

  getUsers(query: string) {
    this.router.navigate(['search'], { queryParams: { interest: query } })
  }

  displayFn(interest: Interest): string {
    return interest && interest.name ? interest.name : '';
  }

  private _filter(name: string): Interest[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  async ngOnInit(): Promise<void> {
    await this.getInterests()

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()

    this.ngUnsubscribe.complete()
  }
}
