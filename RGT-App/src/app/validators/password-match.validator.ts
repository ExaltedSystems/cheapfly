import { FormGroup } from '@angular/forms';

import {  } from '@angular/forms';
 
export class PasswordMatchValidators {
    static validate(registerForm: FormGroup) {
        let password = registerForm.controls.password.value;
        let retype_password = registerForm.controls.retype_password.value;
 
        if (retype_password.length <= 0) {
            return null;
        }
 
        if (retype_password !== password) {
            return {
                doesMatchPassword: true
            };
        }
 
        return null;
 
    }
}