import { UserService } from './../services/user.service';
import { AbstractControl } from '@angular/forms';

export class ValidateEmailNotTaken {
  static createValidator(userService: UserService) {
    return (control: AbstractControl) => {
      return userService.checkEmailNotTaken(control.value).map(res => {
        return res ? null : { emailTaken: true };
      });
    };
  }
}