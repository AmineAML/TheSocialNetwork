import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MessageSnackBarComponent } from '../../../shared/components/message-snack-bar/message-snack-bar.component';
import { Userss } from '../../../shared/types';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedIn: boolean = false

  faCaretDown = faCaretDown

  user: string

  username: string

  dataSource: Userss = null

  //Handle unsubscriptions
  private ngUnsubscribe = new Subject()

  isServerRespondedWithData: Promise<boolean>

  constructor(private authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private snackBar: MatSnackBar) { }

  async getUser() {
    this.authService.authenticatedUser().pipe(
      map(async (username: string | null) => {
        this.username = username

        await this.getUserProfile()

        this.authService.loggedUsername = this.username
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()
  }

  async getUserProfile() {
    this.dataService.findByUsername(this.username).pipe(
      map((userData: Userss) => {
        this.dataSource = userData

        this.isServerRespondedWithData = Promise.resolve(true)
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()
  }

  isAuthenicated() {
    this.authService.loginStatusChange().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(async loggedIn => {
      if (loggedIn) {
        await this.getUser()
      } else {
        this.username = null

        this.dataSource = null
      }
    });
  }

  editedAvatarLink() {
    this.authService.getAvatarLink().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((value: boolean) => {
      if (value) {
        this.getUserProfile()
      }
    })
  }

  logout() {
    this.authService.logout().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe()

    this.isServerRespondedWithData = Promise.resolve(false)

    this.router.navigate(['/'])

    this.snackBar.openFromComponent(MessageSnackBarComponent, {
      duration: 7000,
      data: {
        message: "You've been logged out",
        hasError: false
      },
      horizontalPosition: "end",
      verticalPosition: "top"
    })
  }

  async ngOnInit(): Promise<void> {
    this.isAuthenicated()

    this.editedAvatarLink()
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()

    this.ngUnsubscribe.complete()
  }
}
