import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-not-confirmed',
  templateUrl: './email-not-confirmed.component.html',
  styleUrls: ['./email-not-confirmed.component.scss']
})
export class EmailNotConfirmedComponent implements OnInit, OnDestroy {

  constructor() { }

  close() {
    this.ngOnDestroy()
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    
  }

}
