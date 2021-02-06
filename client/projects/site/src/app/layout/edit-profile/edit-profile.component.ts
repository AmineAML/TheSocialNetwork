import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faLinkedin, faTwitter, faTiktok, faDiscord, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { Userss } from '../profile/profile.component';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';

export interface File {
  data: any
  avatar_progress: number
  background_progress: number
  inProgress: boolean
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {
  faTimes = faTimes
  faFacebook = faFacebook
  faLinkedin = faLinkedin
  faTwitter = faTwitter
  faTiktok = faTiktok
  faDiscord = faDiscord
  faInstagram = faInstagram
  faYoutube = faYoutube

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  interestCtrl = new FormControl();
  filteredInterests: Observable<string[]>;
  //fruits: string[] = ['Lemon'];
  interests: string[] = [];
  allInterests: string[] = [];
  addOnBlur = true;

  username: string

  dataSource: Userss = null

  form: FormGroup

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @ViewChild('fileUploadAvatar', { static: false }) fileUploadAvatar: ElementRef
  @ViewChild('fileUploadBackground', { static: false }) fileUploadBackground: ElementRef

  file: File = {
    data: null,
    inProgress: false,
    avatar_progress: 0,
    background_progress: 0
  }

  //Handle unsubscriptions
  private ngUnsubscribe = new Subject()

  isServerRespondedWithData: Promise<boolean>

  constructor(private dataService: DataService,
    private authService: AuthService,
    private formBuilder: FormBuilder) {
    this.filteredInterests = this.interestCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allInterests.slice()));
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.interests.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.interestCtrl.setValue(null);
  }

  remove(interest: string): void {
    const index = this.interests.indexOf(interest);

    if (index >= 0) {
      this.interests.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.interests.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.interestCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allInterests.filter(interest => interest.toLowerCase().indexOf(filterValue) === 0);
  }

  async getUser() {
    this.dataService.findByUsername(this.username).pipe(
      //Display data into console log
      tap(users => console.log('ree' + users)),
      map((userData: Userss) => {
        this.dataSource = userData

        let avatar, background

        if (this.dataSource.user.image !== null) {
          this.dataSource.user.image.forEach(image => {
            if (image.type === 'avatar') {
              avatar = image.link
            } else if (image.type === 'background') {
              background = image.link
            }
          })
        }

        this.form.patchValue({
          id: userData.user.id,
          first_name: userData.user.first_name,
          last_name: userData.user.last_name,
          description: userData.user.description,
          gender: userData.user.gender,
          social_media: userData.user.social_media || {},
          avatar: avatar,
          background: background
        })

        this.interests = this.dataSource.user.interest

        this.isServerRespondedWithData = Promise.resolve(true)
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()

    console.log(this.dataSource)

    setTimeout(() => console.log(this.dataSource), 7000)

    console.log(this.username)
  }

  update() {
    // this.form.patchValue({
    //   interest: this.interests
    // })

    this.interests.forEach(interest => {
      this.aliases.push(this.formBuilder.control(interest));
    })
    this.dataService.updateUser(this.form.getRawValue()).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe()
  }

  get aliases() {
    return this.form.get('interest') as FormArray;
  }

  addAlias() {
    this.aliases.push(this.formBuilder.control(''));
  }

  uploadProfileAvatar() {
    const fileInput = this.fileUploadAvatar.nativeElement

    fileInput.click()

    fileInput.onchange = () => {
      this.file = {
        data: fileInput.files[0],
        inProgress: false,
        avatar_progress: 0,
        background_progress: 0
      }
      this.fileUploadAvatar.nativeElement.value = ''

      let type = 'avatar'

      this.uploadFile(type)
    }
  }

  uploadProfileBackground() {
    const fileInput = this.fileUploadBackground.nativeElement

    fileInput.click()

    fileInput.onchange = () => {
      this.file = {
        data: fileInput.files[0],
        inProgress: false,
        avatar_progress: 0,
        background_progress: 0
      }
      this.fileUploadBackground.nativeElement.value = ''

      let type = 'background'

      this.uploadFile(type)
    }
  }

  showAvatarSpinner = false

  showBackgroundSpinner = false

  uploadFile(type: string) {
    const formData = new FormData()

    formData.append(type, this.file.data)

    this.file.inProgress = true

    this.dataService.uploadProfileAvatar(formData).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.loaded === event.total && type === 'avatar') {
              this.showAvatarSpinner = true
              this.file.avatar_progress = Math.round(event.loaded * 100 / event.total)
            }
            if (event.loaded === event.total && type === 'background') {
              this.showBackgroundSpinner = true
              this.file.background_progress = Math.round(event.loaded * 100 / event.total)
            }
            break;
          case HttpEventType.Response:
            if (type === 'avatar') {
              this.file.avatar_progress = 0
              return event
            }
            if (type === 'background') {
              this.file.background_progress = 0
              return event
            }
        }
      }),
      takeUntil(this.ngUnsubscribe),
      catchError((error: HttpErrorResponse) => {
        this.file.inProgress = false

        return of('Upload failed')
      })
    ).subscribe(async (event: any) => {
      console.log(event)
      if (typeof event === 'object') {
        if (type === 'avatar') {
          this.form.patchValue({
            avatar: event.body.data.images[0].link
          })
          this.showAvatarSpinner = false
          this.authService.setAvatarLink(true);
        } else {
          this.form.patchValue({
            background: event.body.data.images[0].link
          })
          this.showBackgroundSpinner = false
        }
      }
    })
  }

  ngOnInit(): void {
    this.username = this.authService.loggedUsername

    this.form = this.formBuilder.group({
      id: [{ value: null, disabled: true }, [Validators.required]],
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      interest: this.formBuilder.array([]),
      social_media: this.formBuilder.group({
        facebook: [null, [Validators.required]],
        linkedin: [null, [Validators.required]],
        twitter: [null, [Validators.required]],
        tiktok: [null, [Validators.required]],
        discord: [null, [Validators.required]],
        instagram: [null, [Validators.required]],
        youtube: [null, [Validators.required]]
      }),
      avatar: [null],
      background: [null]
    })

    this.getUser()
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()

    this.ngUnsubscribe.complete()
  }
}
