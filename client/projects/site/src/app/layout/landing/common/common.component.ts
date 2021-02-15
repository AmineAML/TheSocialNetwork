import { Component, Input, OnDestroy, OnInit } from '@angular/core';

export interface Interest {
  name: string;
}

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss']
})
export class CommonComponent implements OnInit {
  @Input() options: Interest[]

  constructor() { }

  async ngOnInit(): Promise<void> {
    
  }
}
