import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  interest: string

  constructor(private activatedRoute: ActivatedRoute) { }

  getUsers() {
    //this.data.getUsersBySearchQuery(this.interest)
    console.log(this.interest)
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.interest = params.interest
    })
  }

}
