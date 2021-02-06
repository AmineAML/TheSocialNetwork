import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faFacebook, faLinkedin, faTwitter, faTiktok, faDiscord, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { DataService, User, UserData, Image, Link, Meta } from '../../core/services/data.service';

export interface Userr extends User {
  image: Image[]
}

export interface Userss {
  user: Userr,
  link: Link,
  meta: Meta
}


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  faFacebook = faFacebook
  faLinkedin = faLinkedin
  faTwitter = faTwitter
  faTiktok = faTiktok
  faDiscord = faDiscord
  faInstagram = faInstagram
  faYoutube = faYoutube
  faEllipsisH = faEllipsisH

  username: string

  dataSource: Userss = null

  //Handle unsubscriptions
  private ngUnsubscribe = new Subject()

  isServerRespondedWithData: Promise<boolean>

  constructor(private dataService: DataService,
              private activatedRoute: ActivatedRoute) { }

  async getUser() {
    this.dataService.findByUsername(this.username).pipe(
      //Display data into console log
      //tap(users => console.log('ree' + users)),
      map((userData: Userss) => {
        this.dataSource = userData

        this.isServerRespondedWithData = Promise.resolve(true)
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()

    //console.log(this.dataSource)

    //setTimeout(() => console.log(this.dataSource), 7000)

    //console.log(this.username)
  }

  async ngOnInit(): Promise<void> {
    this.username = this.activatedRoute.snapshot.paramMap.get('username')

    await this.getUser()
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()

    this.ngUnsubscribe.complete()
  }
}
