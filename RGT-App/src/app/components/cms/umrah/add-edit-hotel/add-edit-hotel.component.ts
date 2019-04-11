import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs/Observable';
import { Route, Router, NavigationExtras, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DataServiceService } from 'app/services/data-service.service';
import { MainServiceService } from 'app/services/main.service';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatSort, MatTableDataSource, MatDatepickerModule, MatCommonModule, MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { MatTabsModule } from '@angular/material/tabs';
import { Element } from '@angular/compiler';
import { MatMenuModule } from '@angular/material/menu';
import { CKEditorModule } from 'ngx-ckeditor';
import * as visa_options from '../../../../assets/visa_options.json';
import { User } from 'app/models';
import * as jwt_decode from 'jwt-decode';
import { AlertService } from 'app/services';
declare var jQuery;

@Component({
  selector: 'app-add-edit-hotel',
  templateUrl: './add-edit-hotel.component.html',
  styleUrls: ['./add-edit-hotel.component.css'],
  providers: [DatePipe]
})
export class AddEditHotelComponent implements OnInit {
  currentUser: User;
  hotelForm: FormGroup;
  hotelFormData: object;
  accommodations: FormArray;
  currentDate: Date = new Date();
  weekend = [];
  selectedWeekend = [];
  dropdownSettings = {};
  // Hotel Id For Edit
  hotelId: any;
  editForm: boolean = false;
  constructor(
    private __fbuild: FormBuilder, private __ms: MainServiceService, private __ds: DataServiceService, private __actRoute: ActivatedRoute,
    private __router: Router, private __datePipe: DatePipe, private __el: ElementRef, private __alertServ: AlertService) {
    // Get Current Login UserId
    this.currentUser = jwt_decode(localStorage.getItem('currentUser')).id;
  }

  ngOnInit() {
    this.__actRoute.paramMap.subscribe(param => {
      if (param.get('id')) this.editForm = true;
      this.hotelId = param.get('id');
    });
    this.updateHotelDetails();
    this.weekend = [
      { item_id: 'Thu', item_text: 'Thursday' },
      { item_id: 'Fri', item_text: 'Friday' },
      { item_id: 'Sat', item_text: 'Saturday' },
      { item_id: 'Sun', item_text: 'Sunday' },
      { item_id: 'Mon', item_text: 'Monday' },
      { item_id: 'Tue', item_text: 'Tuesday' },
      { item_id: 'Wed', item_text: 'Wednesday' },
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.hotelForm = this.__fbuild.group({
      locationId: ['', Validators.required],
      hotelName: ['', Validators.required],
      hotelType: ['', Validators.required],
      roomType: ['', Validators.required],
      hotelMarkup: [''],
      hotelWeekend: [''],
      weekendMarkup: [''],
      description: [''],
      hotelVendor: ['', Validators.required],
      status: [''],
      accommodations: this.__fbuild.array([this.accommodationFields()]),
    });
    this.addAccommodationFields();
  }
  accommodationFields(): FormGroup {
    return this.__fbuild.group({
      hotelRateId: [''],
      dateRange: ['', Validators.required],
      dbRoomPrice: ['', Validators.required],
      tpRoomPrice: ['', Validators.required],
      qdRoomPrice: ['', Validators.required],
    });
  }
  addAccommodationFields(): void {
    this.accommodations = this.hotelForm.get('accommodations') as FormArray;
    if (this.accommodations.length <= 10) {
      this.accommodations.push(this.accommodationFields());
    }
  }
  // remove row form bed types form
  removeAccommodationFields(index): void {
    if (index >= 10) {
      this.accommodations = this.hotelForm.get('accommodations') as FormArray;
      this.accommodations.removeAt(index);
    }
  }
  createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }
  addUpdateHotel(formData) {
    console.log('Form Values: ', formData);
    if (this.hotelForm.valid) {
      this.hotelFormData = {
        'ID': this.hotelId,
        'locationId': formData.locationId,
        'hotelName': formData.hotelName,
        'typeId': formData.hotelType,
        'roomType': formData.roomType,
        'hotelMarkup': formData.hotelMarkup,
        'weekend': formData.hotelWeekend,
        'weekendPercent': formData.weekendMarkup,
        'description': formData.description,
        'hotelVendor': formData.hotelVendor,
        'status': formData.status,
        'accommodations': formData.accommodations,
        'userId': this.currentUser,
      }
      return this.__ds.postData(this.__ms.url + 'Cms/addEditUmrahHotel', this.hotelFormData)
        .subscribe(res => {
          this.__alertServ.success(res.message);
          setTimeout(() => { this.__router.navigate(['/umrah-hotels-list']); }, 3000);
        })
    }  else {
      this.__alertServ.error('Please fill all the required fields....!')
      /* Move focus to first Required / Invalid field */
      let target;
      target = this.__el.nativeElement.querySelector('.ng-invalid');
      if (target) {
        jQuery('html,body').animate({ scrollTop: jQuery(target).offset().top }, 'slow');
        target.focus();
      }
    }
  }
  updateHotelDetails() {
    if (this.editForm) {
      this.__ds.getData(this.__ms.url + 'cms/editUmrahHotelRecord?id=' + this.hotelId).subscribe(res => {
        console.log('HotelDetails:', res);
        this.hotelForm.controls['locationId'].setValue(res.data['locationId']);
        this.hotelForm.controls['hotelName'].setValue(res.data['hotelName']);
        this.hotelForm.controls['hotelType'].setValue(res.data['typeId']);
        this.hotelForm.controls['roomType'].setValue(res.data['roomType']);
        this.hotelForm.controls['hotelMarkup'].setValue(res.data['markup']);
        this.selectedWeekend = res.data['weekendStr'];
        // this.hotelForm.controls['hotelWeekend'].setValue(res.data['weekend']);
        this.hotelForm.controls['weekendMarkup'].setValue(res.data['weekendPercent']);
        this.hotelForm.controls['hotelVendor'].setValue(res.data['hotelVendor']);
        this.hotelForm.controls['status'].setValue((res.data['status'] ? true : false));
        this.hotelForm.controls['description'].setValue(res.data['description']);
        let accommodations = res.data['accommodations'];
        let dataLength = accommodations.length;
        if (dataLength > 2) {
          for (let i = 2; i < dataLength; i++) {
            this.addAccommodationFields();
          }
        }
        // console.log('Length2:', accommodations.length);
        let formArray = this.hotelForm.controls['accommodations'] as FormArray;
        accommodations.forEach((element, key) => {
          // console.log("element:",element);
          let formGroup = formArray.controls[key] as FormGroup;
          let fromDate = new Date(element.fromDate);//this.__datePipe.transform(element.fromDate, 'mm.dd.yy');
          let toDate = new Date (element.toDate);//this.__datePipe.transform(element.toDate, 'mm.dd.yy');
          console.log('FromDate:', fromDate)
          // console.log("formGroup:", formGroup);
          formGroup.controls['hotelRateId'].setValue(element.ID);
          let dateRange = [fromDate, toDate];
          // formGroup.controls['dateRange'].setValue(fromDate + ', ' + toDate);
          formGroup.controls['dateRange'].setValue(dateRange);
          formGroup.controls['dbRoomPrice'].setValue(element.dbRoomPrice);
          formGroup.controls['tpRoomPrice'].setValue(element.tpRoomPrice);
          formGroup.controls['qdRoomPrice'].setValue(element.qdRoomPrice);
        });
      });
    }
  }

}
