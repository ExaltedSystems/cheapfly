
import { Component, OnInit, Input } from '@angular/core';
import { MainServiceService } from './../../../services/main.service';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { DataServiceService } from '../../../services/data-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../../models/index';
import * as jwt_decode from 'jwt-decode';
import { ToasterService } from 'angular2-toaster/src/toaster.service';
declare const CKEDITOR: any;

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {

  currentUser: User;
  hotelForm: FormGroup;
  hotelFormData: object;
  editId: any;

  constructor(private __fb: FormBuilder, private __ds: DataServiceService, private __ms: MainServiceService, private __router: Router,
    private __actRouter: ActivatedRoute, private __toastServ: ToasterService) {
    // Get Current Login UserId
    this.currentUser = jwt_decode(localStorage.getItem('currentUser')).id;
  }

  ngOnInit() {
    this.hotelForm = this.__fb.group({
      contents: ['', Validators.required]
    });
    // CKEDITOR.destroy();
    this.__setHotelContents();
  }
  __setHotelContents() {
    this.__ds.getData(this.__ms.url + 'Cms/hotelContents').subscribe(res => {
      if (res.data) {
        this.editId = res.data['ID'];
        this.hotelForm.controls['contents'].setValue(res.data['contents']);
      }
    });
  }
  // Send New Visa Form Data for Insertion / Updation 10-07-2018 11:49 AM
  addEditHotelData(formInputs) {
    if (this.hotelForm.valid) {
      this.hotelFormData = {
        'ID': this.editId,
        'contents': formInputs.contents,
        'userId': this.currentUser,
        'type': '2',
      }
      // Post data to desire url using services to Restful API controller 
      return this.__ds.postData(this.__ms.url + 'Cms/addEditFlightHotelContents', this.hotelFormData)
        .subscribe(res => {
          this.__toastServ.pop('success', 'Insert / Update', res.message);
          this.__setHotelContents();
        });
    } else {
      this.__toastServ.pop('error', 'Error Info', `Please fill-out all the required fields`);
    }
  }

}

