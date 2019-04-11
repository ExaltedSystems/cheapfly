import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';
import * as jwt_decode from 'jwt-decode';
import { ActivatedRoute } from '@angular/router/';
import { CKEditorModule } from 'ngx-ckeditor';
import { DataServiceService } from 'app/services/data-service.service';
import { MainServiceService } from 'app/services/main.service';
import { User } from 'app/models';
import { AlertService, UserService } from 'app/services';
import { PasswordMatchValidators } from '../../validators/password-match.validator';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
// 06-09-2018 03:42 PM
export class NewUserComponent implements OnInit {
  pageUrl: string;
  addEditUser: FormGroup;
  passwordFormGroup: FormGroup
  currentUser: User;
  param: any;
  isParent: number = 0;
  addEditUserData: object;
  userEditId: any = '';
  pageData: any = '';
  parentList: any;
  showHidePassword: boolean = false;
  public user = {
    password: <string>null
  };

  constructor(private __fb: FormBuilder, private __ds: DataServiceService, private __ms: MainServiceService,
    private __actRoute: ActivatedRoute, private __alertServ: AlertService, private __userServ: UserService
  ) {
    this.currentUser = jwt_decode(localStorage.getItem('currentUser')).id;
  }

  options: FancyImageUploaderOptions = {
    thumbnailHeight: 322,
    thumbnailWidth: 322,
    uploadUrl: this.__ms.url + 'Cms/uploadPic',
    allowedImageTypes: ['image/png', 'image/jpeg'],
    maxImageSize: 3
  };

  ngOnInit() {
    this.addEditUser = this.__fb.group({
      name: ['', Validators.required],
      email: ['',
        [Validators.required, Validators.email],
        this.validateEmailNotTaken.bind(this)
      ],
      passwordFormGroup: this.passwordFormGroup
    });
    this.passwordFormGroup = this.__fb.group({
      password: ['', Validators.required],
      retype_password: ['', Validators.required]
    }, { validator: PasswordMatchValidators.validate.bind(this) });

    this.param = this.__actRoute.params.subscribe(urlId => {
      this.userEditId = this.__actRoute.snapshot.queryParams.id;
    });
    if (this.userEditId) {
      this.__ds.getData(this.__ms.url + 'auth/viewUserDetails/?id=' + this.userEditId).subscribe(res => {
        this.addEditUser.controls['name'].setValue(res['data']['username']);
        this.addEditUser.controls['email'].setValue(res['data']['email']);
      });
    }
  }
  
  validateEmailNotTaken(control: AbstractControl) {
    return this.__userServ.checkEmailNotTaken(control.value).map(res => {
      return res ? null : { emailTaken: true };
    });
  }

  onUpload(file: UploadedFile) {
    console.log(file.response);
  }

  addEditUsers(formData) {
    if (this.addEditUser.valid) {
      this.addEditUserData = {
        'id': this.userEditId,
        'username': formData.name,
        'email': formData.metaTitle,
        'password': formData.password,
        'confirm_password': formData.confirm_password
      }

      return this.__ds.postData(this.__ms.url + 'auth/register', this.addEditUserData)
        .subscribe(res => {
          this.__alertServ.error(res.message);
        });

    } else {
      this.__alertServ.error('Please fill all the required fields....!');
      this.addEditUser.controls['name'].markAsTouched();
      this.addEditUser.controls['email'].markAsTouched();
    }
  }
  onRemoved(file) {
    // do some stuff with the removed file.
  }
}
