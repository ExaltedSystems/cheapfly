import { AlertService } from './../../services/alert.service';
import { UserService } from './../../services/user.service';
import { MainServiceService } from './../../services/main.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DataServiceService } from '../../services/data-service.service';
import { PasswordMatchValidators } from '../../validators/password-match.validator';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  registerForm: FormGroup;
  passwordFormGroup : FormGroup
  registerUserData: object;
  regUserMsg: '';

  public user = {
      password: <string>null
  };
  public barLabel: string = "Password strength:";
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];

  constructor(private _formBuilder: FormBuilder, private dataService: DataServiceService, 
    private mainService: MainServiceService, private userService: UserService, private alertService: AlertService, private router: Router) { }

  ngOnInit() {
    this.registerForm = this._formBuilder.group({
      name : ['',Validators.required],
      email : ['',
        [Validators.required, Validators.email],
        this.validateEmailNotTaken.bind(this)
      ],
      // password: this.passwordFormGroup.get('password').value,
      passwordFormGroup: this.passwordFormGroup
    });

    this.passwordFormGroup = this._formBuilder.group({
      password : ['',Validators.required],
      retype_password : ['',Validators.required]
    }, {
      validator: PasswordMatchValidators.validate.bind(this)
    });

  }

  validateEmailNotTaken(control: AbstractControl) {
    return this.userService.checkEmailNotTaken(control.value).map(res => {
      return res ? null : { emailTaken: true };
    });
  }

  /**
   * Register New User
   * @param data 
   */
  registerUser(data) {
    if(this.registerForm.valid){
      this.registerUserData = {
        'username' : this.registerForm.get('name').value,
        'email' : this.registerForm.get('email').value,
        'password' : this.passwordFormGroup.controls['password'].value,
        'confirm_password' : this.passwordFormGroup.controls['retype_password'].value
      }
      console.log(this.registerUserData)
      return this.userService.create(this.mainService.url+'auth/register',this.registerUserData)
      .subscribe(res => {
        console.log(res);
        this.alertService.success(res.message);
        this.registerForm.reset();
      });
    } else {
      this.alertService.error('Please fill all required fields.');
      this.registerForm.controls['name'].markAsTouched();
      this.registerForm.controls['email'].markAsTouched();
      this.registerForm.controls['password'].markAsTouched();
      this.registerForm.controls['retype_password'].markAsTouched();
    }
  }

}


