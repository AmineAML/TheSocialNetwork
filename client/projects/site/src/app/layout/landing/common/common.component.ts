import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { DataService, InterestData } from '../../../core/services/data.service';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss']
})
export class CommonComponent implements OnInit {
  dataSource: InterestData = null

  async getInterests() {
    this.dataService.findAllInterestsSorted().pipe(
      //Display data into console log
      tap(interests => console.log('ree' + interests)),
      map((interestData: InterestData) => {
        this.dataSource = interestData
      })
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

}
