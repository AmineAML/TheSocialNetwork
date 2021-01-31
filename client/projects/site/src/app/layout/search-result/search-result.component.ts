import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { DataService, UserData, ImageData, Image, User, Link, Meta, InterestData } from '../../core/services/data.service';

export interface Users extends User {
  image: Image[]
}

export interface Userss {
  users: Users[],
  link: Link,
  meta: Meta
}

export interface Interest {
  name: string;
}

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  @Input() paginator: MatPaginator

  interest: string

  page: number

  size: number

  dataSource: Userss = null

  myControl = new FormControl();
  
  options: Interest[] = [];

  filteredOptions: Observable<Interest[]>;

  interestSource: InterestData = null

  constructor(private activatedRoute: ActivatedRoute,
              private dataService: DataService,
              private router: Router,
              private location: Location) { }

  async getUsers() {
    this.dataService.findByQuery(this.interest, this.page, this.size).pipe(
      //Display data into console log
      tap(users => console.log('ree' + users)),
      map((userData: Userss) => this.dataSource = userData)
    ).subscribe()

    console.log(this.dataSource)

    setTimeout(() => console.log(this.dataSource), 7000)

    console.log(this.interest)

    //Modify the url
    const url = this.router.createUrlTree([], { relativeTo: this.activatedRoute, queryParams: { interest: this.interest, page: this.page, size: this.size } }).toString()

    this.location.go(url);
  }

  async pageEvents(event: PageEvent) {
    console.log(`Page size: ${event.pageSize}`)

    //Last page
    if (event.pageIndex + 1 === this.dataSource.meta.totalPages) {
      this.page = this.dataSource.meta.totalPages

      this.size

      await this.getUsers()
    }

    //First page
    else if (event.pageIndex + 1 === 1) {
      this.page = 1

      this.size

      await this.getUsers()
    }

    //Next page
    else if (event.pageIndex + 1 > this.dataSource.meta.currentPage) {
      this.page = this.dataSource.meta.currentPage + 1

      console.log('Ree ' + this.page)

      this.size

      await this.getUsers()
    } 

    //Previous page
    else {
      this.page = this.dataSource.meta.currentPage - 1

      this.size

      await this.getUsers()
    }

    if (event.pageSize != this.size) {
      this.page = this.dataSource.meta.currentPage

      this.size = event.pageSize

      console.log(this.page)

      console.log(this.size)

      await this.getUsers()
    }

    console.log(`Page number ${event.pageIndex + 1}`)
  }

  displayFn(interest: Interest): string {
    return interest && interest.name ? interest.name : '';
  }

  private _filter(name: string): Interest[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  async getInterests() {
    this.dataService.findAllInterestsSorted().pipe(
      //Display data into console log
      tap(interests => console.log('ree' + interests)),
      map((interestData: InterestData) => {
        this.interestSource = interestData
        
        this.interestSource.data.interests.forEach(interest => {
          this.options.push(
            { name: interest.name }
          )

          console.log(interest)
        })
      })
    ).subscribe()
  }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.queryParams.subscribe(params => {
      this.interest = params.interest
      this.page = params.page || 1
      this.size = params.size || 10
    })

    await this.getUsers()

    await this.getInterests()

    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.options.slice())
    );
  }

}
