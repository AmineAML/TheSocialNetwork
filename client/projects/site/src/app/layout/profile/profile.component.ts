import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { faFacebook, faLinkedin, faTwitter, faTiktok, faDiscord, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DialogReportComponent } from '../../core/components/dialog-report/dialog-report.component';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { Userss } from '../../shared/types';


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
  
  dataSourceOfAuthenticated: Userss = null

  //Handle unsubscriptions
  private ngUnsubscribe = new Subject()

  isServerRespondedWithData: Promise<boolean>

  similarInterests: number = 0

  constructor(private dataService: DataService,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              private authService: AuthService) { }

  async getUser() {
    this.dataService.findByUsername(this.username).pipe(
      //Display data into console log
      //tap(users => console.log(users)),
      map((userData: Userss) => {
        this.dataSource = userData

        this.isServerRespondedWithData = Promise.resolve(true)

        if (userData.user !== null) {
          this.getAuthenticatedUser()
        }
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()
  }

  async getAuthenticatedUser() {
    this.dataService.findByUsername(this.authService.loggedUsername).pipe(
      //Display data into console log
      //tap(users => console.log('ree' + users)),
      map((userData: Userss) => {
        if (this.dataSource.user.interest && this.dataSource.user.interest.length > 0 && userData.user.interest && userData.user.interest.length > 0) {
          this.similarInterests = this.count_similarities(this.dataSource.user.interest, userData.user.interest)
        }
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()
  }

  reportByDialog(): void {
    const dialogRef = this.dialog.open(DialogReportComponent, {
      width: '50vw',
      data: {
        //reported_user_id: this.dataSource.user.id,
        username: this.dataSource.user.username
      }
    });

    dialogRef.afterClosed().subscribe(description => {
      if (description) {
        let reportForm = {
          reported_user_id: this.dataSource.user.id,
          description
        }
  
        this.dataService.reportUserProfile(reportForm).pipe(
          takeUntil(this.ngUnsubscribe)
        ).subscribe()
      }
    })
  }

  count_similarities(profileUserInterests: Array<string>, authUserInterests: Array<string>) {
    var matches = 0;
    for (let i = 0; i < profileUserInterests.length; i++) {
        if (authUserInterests.indexOf(profileUserInterests[i]) != -1)
            matches++;
    }
    return matches;
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
