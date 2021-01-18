import { Component, OnInit } from '@angular/core';
import { faFacebook, faLinkedin, faTwitter, faTiktok, faDiscord, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  faFacebook = faFacebook
  faLinkedin = faLinkedin
  faTwitter = faTwitter
  faTiktok = faTiktok
  faDiscord = faDiscord
  faInstagram = faInstagram
  faYoutube = faYoutube
  faEllipsisH = faEllipsisH

  constructor() { }

  ngOnInit(): void {
  }

}
