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
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {

  currentUser: User;
  flightForm: FormGroup;
  flightFormData: object;
  editId: any;

  constructor(private __fb: FormBuilder, private __ds: DataServiceService, private __ms: MainServiceService, private __router: Router,
    private __actRouter: ActivatedRoute, private __toastServ: ToasterService) {
    // Get Current Login UserId
    this.currentUser = jwt_decode(localStorage.getItem('currentUser')).id;
  }

  ngOnInit() {
    this.flightForm = this.__fb.group({
      contents: ['', Validators.required]
    });
    // CKEDITOR.destroy();
    this.__setFlightContents();
  }
  __setFlightContents() {
    this.__ds.getData(this.__ms.url + 'Cms/flightContents').subscribe(res => {
      if (res.data) {
        this.editId = res.data['ID'];
        this.flightForm.controls['contents'].setValue(res.data['contents']);
      }
    });
  }
  // Send New Visa Form Data for Insertion / Updation 10-07-2018 11:49 AM
  addEditFlightData(formInputs) {
    if (this.flightForm.valid) {
      this.flightFormData = {
        'ID': this.editId,
        'contents': formInputs.contents,
        'userId': this.currentUser,
        'type': '1',
      }
      // Post data to desire url using services to Restful API controller 
      return this.__ds.postData(this.__ms.url + 'Cms/addEditFlightHotelContents_post', this.flightFormData)
        .subscribe(res => {
          this.__toastServ.pop('success', 'Insert / Update', res.message);
          this.__setFlightContents();
        });
    } else {
      this.__toastServ.pop('error', 'Error Info', `Please fill-out all the required fields`);
    }
  }

}
