import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MainServiceService } from 'app/services/main.service';
import { DataServiceService } from 'app/services/data-service.service';
import { MatDatepickerModule, MatCommonModule, MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import * as jwt_decode from 'jwt-decode';
declare var jQuery;

@Component({
  selector: 'app-design-custom-pkg',
  templateUrl: './design-custom-pkg.component.html',
  styleUrls: ['./design-custom-pkg.component.css'],
  providers: [DatePipe]
})
export class DesignCustomPkgComponent implements OnInit {

  @Input('form') form: NgForm;
  createUmrahPkgForm: FormGroup;
  createUmrahPkgFormData: object;
  currentUser: number;
  accommodations: FormArray;
  deviceInfo = null;
  ipAddress;
  ipCountry;
  queryString: string;
  passengerError: string;
  numRoomsError: string;
  dropdownMenu: boolean;
  roomTypeDropdownMenu: boolean;
  showUbcPopup: boolean = false;
  isVisa: boolean = true;
  isTransport: boolean = true;
  adults: number = 2;
  children: number = 0;
  infant: number = 0;
  doubleRoom: number = 0;
  tripleRoom: number = 0;
  quadRoom: number = 0;
  currentDate: Date = new Date();
  ubcPopupDetails: any;
  hotelLists: any = [];
  sectorLists: object;
  vehicleLists: object;
  param: any;
  editPageId: any;
  ubcData: object = {
    'adults': 0,
    'children': 0,
    'infant': 0,
    'totalPax': 0,
    'totalNights': 0,
    'clientName': '',
    'clientEmail': '',
    'clientPhone': '',
    'remarks': '',
    'sectorId': '',
    'sectorName': '',
    'vehicleId': '',
    'vehicleName': '',
    'isVisa': 0,
    'hotelPrice': 0,
    'visaPrice': 0,
    'transportPrice': 0,
    'rialRate': 35,
    'totalPackageCost': 0,
  };
  ubcHotels: object;

  constructor(private __fbuild: FormBuilder, private __route: Router, private __actRoute: ActivatedRoute,
    private __datePipe: DatePipe, private __ds: DataServiceService, private __ms: MainServiceService,
    private __webTitle: Title, private el: ElementRef) {
    // Get Current Login UserId
    this.currentUser = jwt_decode(localStorage.getItem('currentUser')).id;
    this.getDeviceInformations();
    this.getAllHotelList();
  }
  ngOnInit() {

    this.param = this.__actRoute.params.subscribe(urlId => {
      this.editPageId = this.__actRoute.snapshot.queryParams.id;
    });
    if (this.editPageId) {
      this.__ds.getData(this.__ms.url + 'cms/customUbcPackageEdit/?id=' + this.editPageId).subscribe(res => {
        this.createUmrahPkgForm.controls['adults'].setValue(res.data['adults']);
        this.createUmrahPkgForm.controls['children'].setValue(res.data['children']);
        this.createUmrahPkgForm.controls['infant'].setValue(res.data['infant']);
        this.createUmrahPkgForm.controls['Name'].setValue(res.data['clientName']);
        this.createUmrahPkgForm.controls['Email'].setValue(res.data['clientEmail']);
        this.createUmrahPkgForm.controls['Phone'].setValue(res.data['clientPhone']);
        this.createUmrahPkgForm.controls['Remarks'].setValue(res.data['remarks']);
        let visa = (res.data['isVisa']==1 ? true : false);
        this.createUmrahPkgForm.controls['visa'].setValue(visa);
        //  
        this.createUmrahPkgForm.controls['vehicleId'].setValue(res.data['vehicleId']);
        this.createUmrahPkgForm.controls['vehicleName'].setValue(res.data['vehicleName']);
        this.createUmrahPkgForm.controls['sectorId'].setValue(res.data['sectorId']);
        this.createUmrahPkgForm.controls['sectorName'].setValue(res.data['sectorName']);
        let umDate = res.data['ubcHotels'][0]['checkIn'];
        console.log(umDate);
        // this.createUmrahPkgForm.controls['accommodations'].setValue(res.data['accommodations']);
        this.createUmrahPkgForm.controls['travelDate'].setValue(new Date(umDate));
        let ubcHotels = res.data['ubcHotels'];
        if (ubcHotels.length > 2) {
          this.accommodationFields();
        }
        ubcHotels.forEach((element, key) => {      
          console.log('Element: ', key)    
          let formArray = this.createUmrahPkgForm.controls['accommodations'] as FormArray;
          let formGroup = formArray.controls[key] as FormGroup;
          formGroup.controls['locations'].setValue(element.locations);
          formGroup.controls['totalNights'].setValue(element.totalNights);
          formGroup.controls['hotelId'].setValue(element.hotelId);
          formGroup.controls['hotelName'].setValue(element.hotelName);
          formGroup.controls['doubleRoom'].setValue(element.doubleRoom);
          formGroup.controls['tripleRoom'].setValue(element.tripleRoom);
          formGroup.controls['quadRoom'].setValue(element.quadRoom);
          formGroup.controls['totalRooms'].setValue(element.totalRooms);
        });

      });
    }
    this.getCountryIpAddress();
    this.getVehicleList();
    this.getSectorList();

    // Initialize Create Package Form Validations
    this.createUmrahPkgForm = this.__fbuild.group({
      adults: ['', Validators.required],
      children: [],
      infant: [],
      Phone: ['', Validators.required],
      travelDate: ['', Validators.required],
      visa: [''],
      isTransport: [''],
      vehicleId: [''],
      vehicleName: [''],
      sectorId: [''],
      sectorName: [''],
      Name: [''],
      Email: [''],
      Remarks: [''],
      formType: [''],
      accommodations: this.__fbuild.array([this.accommodationFields()]),
    });



    this.addAccommodationFields();
    let formArray = this.createUmrahPkgForm.controls['accommodations'] as FormArray;
    let formGroup0 = formArray.controls[0] as FormGroup;
    let formGroup1 = formArray.controls[1] as FormGroup;
    formGroup0.controls['locations'].setValue('Makkah');
    formGroup0.controls['totalNights'].setValue('3');
    formGroup0.controls['doubleRoom'].setValue('1');
    formGroup0.controls['totalRooms'].setValue(1);
    formGroup1.controls['locations'].setValue('Madinah');
    formGroup1.controls['totalNights'].setValue('3');
    formGroup1.controls['doubleRoom'].setValue('1');
    formGroup1.controls['totalRooms'].setValue(1);
    jQuery('#doubleRoomStr0').text("1 Double");
    jQuery('#doubleRoomStr1').text("1 Double");
    jQuery('#roomStr0').text("1 Double, 0 Triple, 0 Quad");
    jQuery('#roomStr1').text("1 Double, 0 Triple, 0 Quad");
    this.createUmrahPkgForm.controls['adults'].setValue('2');
    this.createUmrahPkgForm.controls['children'].setValue('0');
    this.createUmrahPkgForm.controls['infant'].setValue('0');
    this.createUmrahPkgForm.controls['vehicleId'].setValue('0');
    this.createUmrahPkgForm.controls['sectorId'].setValue('0');
  }


  getHotelList(evt, row) {
    console.log("Event: ", evt);
    let formArray = this.createUmrahPkgForm.controls['accommodations'] as FormArray;
    let formGroup0 = formArray.controls[0] as FormGroup;
    let istLocation = formGroup0.controls['locations'].value;
    let formGroup1 = formArray.controls[1] as FormGroup;
    if (istLocation === "Makkah") {
      formGroup1.controls['locations'].setValue('Madinah');
      // jQuery('#accommodationRowError1').text(secLocation + " already selected, please select anther location");
    } else {
      formGroup1.controls['locations'].setValue('Makkah');
      jQuery('#accommodationRowError1').text("");
    }
    let secLocation = formGroup1.controls['locations'].value;
    // let formGroup2: FormGroup;
    // let lastLocation = '';
    if (formArray.length >= 3) {
      let formGroup2 = formArray.controls[1] as FormGroup;
      formGroup2 = formArray.controls[2] as FormGroup;
      formGroup2.controls['doubleRoom'].setValue('1');
      formGroup2.controls['totalRooms'].setValue(1);
      jQuery('#doubleRoomStr2').text("1 Double");
      jQuery('#roomStr2').text("1 Double, 0 Triple, 0 Quad");
      // lastLocation = formGroup2.controls['locations'].value;
      if (secLocation === "Makkah") {
        formGroup2.controls['locations'].setValue('Madinah');
        // jQuery('#accommodationRowError2').text(lastLocation + " already selected, please select anther location");
      } else {
        formGroup2.controls['locations'].setValue('Makkah');
        jQuery('#accommodationRowError2').text("");
      }
    }
    // if (lastLocation != "" && secLocation === "Makkah") {
    //   formGroup2.controls['locations'].setValue('Madinah');
    //   // jQuery('#accommodationRowError2').text(lastLocation + " already selected, please select anther location");
    // } else if (lastLocation != "" && secLocation === "Madinah") {
    //   formGroup2.controls['locations'].setValue('Makkah');
    //   jQuery('#accommodationRowError2').text("");
    // }
  }
  getAllHotelList() {
    this.__ds.getData(this.__ms.url + 'Cms/hotelLists').subscribe(resp => {
      this.hotelLists = resp.data;
    });
  }
  getSectorList() {
    this.__ds.getData(this.__ms.url + 'Cms/sectorLists').subscribe(resp => {
      this.sectorLists = resp.data;
    });
  }
  getVehicleList() {
    this.__ds.getData(this.__ms.url + 'Cms/vehicleLists').subscribe(resp => {
      this.vehicleLists = resp.data;
    });
  }
  getHotelsByType(type) {
    const select = this.hotelLists.find(_ => _.type == type);
    return select ? select.hotels : select;
  }
  setHotelName(evt, row) {
    let selectElementText = evt.target['options'][evt.target['options'].selectedIndex].text;
    //   console.log(selectElementText);
    // console.log("setHotelName: ", evt);
    // let hotelName = evt.source.triggerValue;
    let hotelName = selectElementText;
    let formArray = this.createUmrahPkgForm.controls['accommodations'] as FormArray;
    let formGroup = formArray.controls[row] as FormGroup;
    formGroup.controls['hotelName'].setValue(hotelName);
  }
  getDropdownText(evt, dropdown) {
    // let textValue = evt.source.triggerValue;
    let textValue = evt.target['options'][evt.target['options'].selectedIndex].text;
    console.log('Dropdown: ' + dropdown + ' / Value: ' + textValue);
    if (evt.value != 0 && dropdown == "vehicle") {
      this.createUmrahPkgForm.controls['vehicleName'].setValue(textValue);
    } else if (evt.value != 0 && dropdown == "sector") {
      this.createUmrahPkgForm.controls['sectorName'].setValue(textValue);
    }
  }
  setFormType(formType) {
    this.createUmrahPkgForm.controls['formType'].setValue(formType);
  }
  // get device info
  getDeviceInformations() {
    // this.deviceInfo = this.__device.getDeviceInfo();
  }
  // Adults, Children and Infants Dropdown List
  formDropdownToggle(e, groupName = 'paxNumber', count) {
    e.stopPropagation();
    if (groupName == 'paxNumber') {
      this.dropdownMenu = !this.dropdownMenu;
    } else if (groupName == 'roomNumber') {
      jQuery('#roomTypeDropdownMenuLink' + count)
        .parent()
        .toggleClass('show')
        .nextAll('.dropdown-menu')
        .toggleClass('show block');
    }
  }

  accommodationFields(): FormGroup {
    return this.__fbuild.group({
      locations: ['', Validators.required],
      hotelId: ['', Validators.required],
      totalNights: ['', Validators.required],
      hotelName: [''],
      doubleRoom: [''],
      tripleRoom: [''],
      quadRoom: [''],
      totalRooms: ['', Validators.required]
    });
  }
  addAccommodationFields(): void {
    this.accommodations = this.createUmrahPkgForm.get('accommodations') as FormArray;
    if (this.accommodations.length <= 2) {
      this.accommodations.push(this.accommodationFields());

      let formArray = this.createUmrahPkgForm.controls['accommodations'] as FormArray;
      let formGroup1 = formArray.controls[1] as FormGroup;
      let location = formGroup1.controls['locations'].value;
      console.log(location)
      if (formArray.length >= 3) {
        let formGroup2 = formArray.controls[2] as FormGroup;
        formGroup2.controls['totalNights'].setValue('3');
        if (location === "Makkah") {
          formGroup2.controls['locations'].setValue('Madinah');
        } else {
          formGroup2.controls['locations'].setValue('Makkah');
          jQuery('#accommodationRowError1').text("");
        }
      }
    }
  }
  // remove row form bed types form
  removeAccommodationFields(index): void {
    if (index >= 2) {
      this.accommodations = this.createUmrahPkgForm.get('accommodations') as FormArray;
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

  calcTotalRooms(evt, row) {
    let accForm = this.createUmrahPkgForm.controls['accommodations'] as FormArray;
    let accGroup = accForm.controls[row] as FormGroup;
    let doubleRoom = +accGroup.controls['doubleRoom'].value;
    let tripleRoom = +accGroup.controls['tripleRoom'].value;
    let quadRoom = +accGroup.controls['quadRoom'].value;
    let totalRooms = doubleRoom + tripleRoom + quadRoom;
    accGroup.controls['totalRooms'].setValue(totalRooms);
  }

  incrementNumber(type, groupName = 'paxNumber', row) {
    this.passengerError = '';
    let totalDoubleRoom = +jQuery('#doubleRoom' + row).val();
    let totalTripleRoom = +jQuery('#tripleRoom' + row).val();
    let totalQuadRoom = +jQuery('#quadRoom' + row).val();
    switch (type) {
      case 'adults': {
        this.adults += 1;
        break;
      }
      case 'children': {
        this.children += 1;
        break;
      }
      case 'infant': {
        this.infant += 1;
        break;
      }
      case 'doubleRoom': {
        this.doubleRoom += 1;
        totalDoubleRoom += 1;
        break;
      }
      case 'tripleRoom': {
        this.tripleRoom += 1;
        totalTripleRoom += 1;
        break;
      }
      case 'quadRoom': {
        this.quadRoom += 1;
        totalQuadRoom += 1;
        break;
      }
    }
    if (groupName == "paxNumber") {
      this.passengerError = '';
      if (this.adults + this.children + this.infant > 40) {
        this.passengerError = 'Please Select Upto 30 Passengers!';
        return false;
      }
    } else if (groupName == "roomNumber") {
      jQuery('#doubleRoomStr' + row).text(totalDoubleRoom + " Double");
      jQuery('#tripleRoomStr' + row).text(totalTripleRoom + " Triple");
      jQuery('#quadRoomStr' + row).text(totalQuadRoom + " Quad");
      let accForm = this.createUmrahPkgForm.controls['accommodations'] as FormArray;
      let accGroup = accForm.controls[row] as FormGroup;
      let totalRooms = totalDoubleRoom + totalTripleRoom + totalQuadRoom;
      accGroup.controls['doubleRoom'].setValue(totalDoubleRoom);
      accGroup.controls['tripleRoom'].setValue(totalTripleRoom);
      accGroup.controls['quadRoom'].setValue(totalQuadRoom);
      accGroup.controls['totalRooms'].setValue(totalRooms);
      this.numRoomsError = '';
      let roomStr = "";
      if (totalRooms <= 0) {
        this.numRoomsError = 'Please Select atleast 1 room type!';
        jQuery('#roomTypeError' + row).text('Please Select atleast 1 room type!');
        roomStr = totalDoubleRoom + " Double, " + totalTripleRoom + " Triple, " + totalQuadRoom + " Quad";
        return false;
      } else {
        roomStr = totalDoubleRoom + " Double, " + totalTripleRoom + " Triple, " + totalQuadRoom + " Quad";
      }
      jQuery('#roomStr' + row).text(roomStr);
    }
  }

  decrementNumber(type, groupName = 'paxNumber', row) {
    let totalDoubleRoom = +jQuery('#doubleRoom' + row).val();
    let totalTripleRoom = +jQuery('#tripleRoom' + row).val();
    let totalQuadRoom = +jQuery('#quadRoom' + row).val();
    switch (type) {
      case 'adults': {
        this.adults--;
        this.adults < 0 ? this.adults = 0 : this.adults;
        break;
      }
      case 'children': {
        this.children--;
        this.children < 0 ? this.children = 0 : this.children;
        break;
      }
      case 'infant': {
        this.infant--;
        this.infant < 0 ? this.infant = 0 : this.infant;
        break;
      }
      case 'doubleRoom': {
        this.doubleRoom--;
        this.doubleRoom < 0 ? this.doubleRoom = 0 : this.doubleRoom;
        totalDoubleRoom--;
        totalDoubleRoom < 0 ? totalDoubleRoom = 0 : totalDoubleRoom;
        break;
      }
      case 'tripleRoom': {
        this.tripleRoom--;
        this.tripleRoom < 0 ? this.tripleRoom = 0 : this.tripleRoom;
        totalTripleRoom--;
        totalTripleRoom < 0 ? totalTripleRoom = 0 : totalTripleRoom;
        break;
      }
      case 'quadRoom': {
        this.quadRoom--;
        this.quadRoom < 0 ? this.quadRoom = 0 : this.quadRoom;
        totalQuadRoom--;
        totalQuadRoom < 0 ? totalQuadRoom = 0 : totalQuadRoom;
        break;
      }
    }
    if (groupName == "paxNumber") {
      this.passengerError = '';
      if (this.adults + this.children + this.infant <= 0) {
        this.passengerError = 'Please Select atleast 1 Passenger!';
        return false;
      }
    } else if (groupName == "roomNumber") {
      jQuery('#doubleRoomStr' + row).text(totalDoubleRoom + " Double");
      jQuery('#tripleRoomStr' + row).text(totalTripleRoom + " Triple");
      jQuery('#quadRoomStr' + row).text(totalQuadRoom + " Quad");
      let accForm = this.createUmrahPkgForm.controls['accommodations'] as FormArray;
      let accGroup = accForm.controls[row] as FormGroup;
      let totalRooms = totalDoubleRoom + totalTripleRoom + totalQuadRoom;
      accGroup.controls['doubleRoom'].setValue(totalDoubleRoom);
      accGroup.controls['tripleRoom'].setValue(totalTripleRoom);
      accGroup.controls['quadRoom'].setValue(totalQuadRoom);
      accGroup.controls['totalRooms'].setValue(totalRooms);
      this.numRoomsError = '';
      let roomStr = "";
      if (totalRooms <= 0) {
        this.numRoomsError = 'Please Select atleast 1 room type!';
        jQuery('#roomTypeError' + row).text('Please Select atleast 1 room type!');
        roomStr = totalDoubleRoom + " Double, " + totalTripleRoom + " Triple, " + totalQuadRoom + " Quad";
        return false;
      } else {
        roomStr = totalDoubleRoom + " Double, " + totalTripleRoom + " Triple, " + totalQuadRoom + " Quad";
      }
      jQuery('#roomStr' + row).text(roomStr);
    }

  }

  // Get Client IP Address and Country
  getCountryIpAddress() {
    this.__ds.getClientInfo('https://ipinfo.io/json')
      .subscribe(resp => {
        this.ipAddress = resp.ip;
        this.ipCountry = resp.country;
      },
      error => {
        console.log('error', error)
        this.ipAddress = '';
        this.ipCountry = '';
      });
  }

  createUmrahPackage(formData) {
    // console.log(this.__datePipe.transform(formData.travelDate, 'yyyy-MM-dd'));
    console.log('Package formData:', formData);
    if (this.createUmrahPkgForm.valid) {
      this.createUmrahPkgFormData = {
        // 'ID' : this.editPageId,
        'adults': formData.adults,
        'children': formData.children,
        'infant': formData.infant,
        'clientName': formData.Name,
        'clientEmail': formData.Email,
        'clientPhone': formData.Phone,
        'clientRemarks': formData.Remarks,
        'visa': formData.visa,
        'isTransport': formData.isTransport,
        'vehicleId': formData.vehicleId,
        'vehicleName': formData.vehicleName,
        'sectorId': formData.sectorId,
        'sectorName': formData.sectorName,
        'accommodations': formData.accommodations,
        'travelDate': this.__datePipe.transform(formData.travelDate, 'yyyy-MM-dd'),
        'pageUrl': this.__route.url,
        'ipAddress': this.ipAddress,
        'country': this.ipCountry,
        'browser': this.deviceInfo.browser,
        'operatingSys': this.deviceInfo.os,
        'deviceFullInfo': JSON.stringify(this.deviceInfo),
        'referrerUrl': document.referrer,
        'formType': formData.formType,
        'createdBy': this.currentUser
      }
      return this.__ds.postData(this.__ms.url + 'Cms/createCustomUbc', this.createUmrahPkgFormData).subscribe(resp => {
        console.log('Response:', resp);
        if (formData.formType == "preview") {
          this.showUbcPopup = true;
          this.ubcData = resp.data['ubcData'];
          this.ubcHotels = resp.data['ubcHotels'];
        }
        this.ubcData = resp.data['ubcData'];
        this.ubcHotels = resp.data['ubcHotels'];
      });
    } else {
      /* Move focus to first Required / Invalid field */
      let target;
      target = this.el.nativeElement.querySelector('.ng-invalid');
      if (target) {
        jQuery('html,body').animate({ scrollTop: jQuery(target).offset().top }, 'slow');
        target.focus();
      }
    }
  }



}
