import { Component, OnInit, ElementRef, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, startWith, takeUntil } from 'rxjs/operators';
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faLinkedin, faTwitter, faTiktok, faDiscord, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageSnackBarComponent } from '../../shared/components/message-snack-bar/message-snack-bar.component';
import { File, User, Userss } from '../../shared/types';
import { ComponentCanDeactivate } from '../../core/guards/form-can-deactivate.guard';

class CustomValidators {
  static passwordMatch(control: AbstractControl): ValidationErrors {
    const password = control.get('new_password').value
    const confirm_password = control.get('confirm_new_password').value

    if ((password !== null && confirm_password !== null) && (password == confirm_password)) {
      return null
    } else {
      return {
        passwordNotMatching: true
      }
    }
  }
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
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
  interests: string[] = [];
  allInterests: string[] = [];
  addOnBlur = true;

  username: string

  dataSource: Userss = null

  form: FormGroup
  
  changePasswordform: FormGroup

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

  showAvatarSpinner = false

  showBackgroundSpinner = false

  originalFormValue: any
  
  originalPasswordFormValue: any

  constructor(private dataService: DataService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar) {
    this.filteredInterests = this.interestCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allInterests.slice()));
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

  uploadFile(type: string) {
    const formData = new FormData()

    formData.append(type, this.file.data)

    this.file.inProgress = true

    this.dataService.uploadProfileAvatar(formData).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (type === 'avatar') {
              this.file.avatar_progress = Math.round(event.loaded * 100 / event.total)
            }
            if (type === 'background') {
              this.file.background_progress = Math.round(event.loaded * 100 / event.total)
            }
            if (event.loaded === event.total && type === 'avatar') {
              this.showAvatarSpinner = true
            }
            if (event.loaded === event.total && type === 'background') {
              this.showBackgroundSpinner = true
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
      //console.log(event)
      if (typeof event === 'object') {
        if (type === 'avatar') {
          this.form.patchValue({
            avatar: event.body.data.images[0].link
          })
          this.showAvatarSpinner = false
          this.authService.setAvatarLink(true);
          this.originalFormValue = this.form.getRawValue();
        } else {
          this.form.patchValue({
            background: event.body.data.images[0].link
          })
          this.showBackgroundSpinner = false
          this.originalFormValue = this.form.getRawValue();
        }
      }
    })
  }

  async getUser() {
    this.dataService.findByUsername(this.username).pipe(
      //Display data into console log
      //tap(users => console.log('ree' + users)),
      map((userData: Userss) => {
        this.dataSource = userData

        if (userData.user !== null) {
          let avatar, background

          if (userData.user.image !== null) {
            userData.user.image.forEach(image => {
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
  
          if (userData.user.interest && userData.user.interest.length > 0) {
            userData.user.interest.forEach(interest => {
              this.aliases.push(this.formBuilder.control(interest))
            })
          }
  
          this.interests = userData.user.interest
  
          this.isServerRespondedWithData = Promise.resolve(true)
  
          this.originalFormValue = this.form.getRawValue();
        }
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()
  }

  update() {
    this.dataService.updateUser(this.form.getRawValue()).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe()

    this.snackBar.openFromComponent(MessageSnackBarComponent, {
      duration: 7000,
      data: {
        message: "Saved modifications",
        hasError: false
      }
    })

    this.originalFormValue = this.form.getRawValue();

    // Set form values as not changed
    this.form.markAsPristine()
  }

  // Resend email confirmation link
  resend() {
    this.dataService.resendEmailConfirmationLink().pipe(
      map((user: User) => {
        if (user) {
          this.snackBar.openFromComponent(MessageSnackBarComponent, {
            duration: 7000,
            data: {
              message: "Email confirmation link sent",
              hasError: false
            }
          })
        }
      }),
      catchError(async (err) => {
        console.log(err)

        this.snackBar.openFromComponent(MessageSnackBarComponent, {
          duration: 7000,
          data: {
            message: "We couldn't send your email confirmation",
            hasError: true
          }
        })
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()
  }

  // Delete user's account
  deleteAccount(id: string) {
    this.authService.delete(id).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe()
  }

  changePassword() {
    this.dataService.changePassword(this.changePasswordform.getRawValue()).pipe(
      map(() => {
        this.snackBar.openFromComponent(MessageSnackBarComponent, {
          duration: 7000,
          data: {
            message: "Password modified sent",
            hasError: false
          }
        })

        this.changePasswordform.reset(this.originalPasswordFormValue)

        // Set form values as not changed
        this.changePasswordform.markAsPristine()
      }),
      catchError(async (err) => {
        console.log(err)

        this.snackBar.openFromComponent(MessageSnackBarComponent, {
          duration: 7000,
          data: {
            message: "We couldn't modify your password",
            hasError: true
          }
        })
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.aliases.push(this.formBuilder.control(value.trim()));

      this.aliases.markAsDirty()
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.interestCtrl.setValue(null);
  }

  remove(i: number): void {
    this.aliases.removeAt(i)

    this.aliases.markAsDirty()
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

  get aliases() {
    return this.form.get('interest') as FormArray;
  }

  addAlias() {
    this.aliases.push(this.formBuilder.control(''));
  }

  loggedInUsername() {
    this.authService.getLoggedInUsername().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((value: boolean) => {
      if (value) {
        this.username = this.authService.loggedUsername

        this.getUser()
      }
    })
  }

  ngOnInit(): void {
    this.username = this.authService.loggedUsername

    this.form = this.formBuilder.group({
      id: [{ value: "", disabled: true }, [Validators.required]],
      first_name: ["", [Validators.required]],
      last_name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      interest: this.formBuilder.array([]),
      social_media: this.formBuilder.group({
        facebook: ["", [Validators.required]],
        linkedin: ["", [Validators.required]],
        twitter: ["", [Validators.required]],
        tiktok: ["", [Validators.required]],
        discord: ["", [Validators.required]],
        instagram: ["", [Validators.required]],
        youtube: ["", [Validators.required]]
      }),
      avatar: [""],
      background: [""]
    })

    this.changePasswordform = this.formBuilder.group({
      password: ["", [
        Validators.required
      ]],
      new_password: ["", [
        Validators.required
      ]],
      confirm_new_password: ["", [
        Validators.required
      ]]
    }, {
      validators: CustomValidators.passwordMatch
    })
    
    this.originalPasswordFormValue = this.changePasswordform.getRawValue();

    this.loggedInUsername()
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()

    this.ngUnsubscribe.complete()
  }

  //Handles warning on unsaved form on refresh page
  @HostListener("window:beforeunload")
  //Handles warning on unsaved form on routing
  canDeactivate() {
    //Compare initial form value with its value on navigation
    return JSON.stringify(this.originalFormValue) !== JSON.stringify(this.form.getRawValue()) ? false : (JSON.stringify(this.originalPasswordFormValue) !== JSON.stringify(this.changePasswordform.getRawValue()) ? false : true)
  }
}
