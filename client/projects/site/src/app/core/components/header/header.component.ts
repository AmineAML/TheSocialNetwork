import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { filter, map, tap } from 'rxjs/operators';
import { Userss } from '../../../layout/profile/profile.component';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean = false

  faCaretDown = faCaretDown

  user: string

  username: string

  dataSource: Userss = null

  constructor(private authService: AuthService,
              private router: Router,
              private dataService: DataService) {}

  async getUser() {
    this.authService.authenticatedUser().pipe(
      map(async (username: string | null) => {
        this.username = username

        await this.getUserProfile()

        console.log(`Logged in ${this.username}`)

        this.authService.loggedUsername = this.username

        //this.loggedIn = true
      })
    ).subscribe()

    //console.log(this.username)

    //setTimeout(() => console.log(this.username), 7000)
  }

  async getUserProfile() {
    this.dataService.findByUsername(this.username).pipe(
      //Display data into console log
      tap(users => console.log('ree' + users)),
      map((userData: Userss) => this.dataSource = userData)
    ).subscribe()

    console.log(this.dataSource)

    setTimeout(() => console.log(this.dataSource), 7000)

    console.log(this.username)
  }

  logout() {
    this.authService.logout().pipe().subscribe()

    this.router.navigate(['/'])

    //this.ngOnInit()
  }

  async ngOnInit(): Promise<void> {
    //await this.getUser()

    this.authService.loginStatusChange().subscribe(async loggedIn => {
      // TODO: apply logic based on logged in status
      if (loggedIn) {
        await this.getUser()
      } else {
        this.username = null

        this.dataSource = null
      }
    });

    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe(async (event: NavigationEnd) => {
    //   if (event.url === '/') {
    //     await this.getUser()
    //   }
    // })
  }

}
