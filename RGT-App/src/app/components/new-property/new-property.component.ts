import { MainServiceService } from './../../services/main.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { DataServiceService } from '../../services/data-service.service';
import { Router } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core'; 
import * as jwt_decode from 'jwt-decode';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import {ToasterService} from 'angular2-toaster';
import { ActivatedRoute } from '@angular/router';
import { MatStep } from '@angular/material';
import { MatStepper } from '@angular/material';
import Json from '*.json';


@Component({
  selector: 'app-new-property',
  templateUrl: './new-property.component.html',
  styleUrls: ['./new-property.component.css'],
  providers: []
})
export class NewPropertyComponent implements OnInit {
  isLinear = true;
  panelOpenState: boolean = false;

  backPage = "/newProperty";
  backpageTitle = 'Propertie Form';

  currentUser;
  val

  // form groups
  basicInfoForm: FormGroup;
  propertyDetailsForm: FormGroup;
  roomDetailsForm: FormGroup;
  amenitiesForm: FormGroup;
  policyForm: FormGroup;
  paymentsForm: FormGroup;

  selectedPropertyType = '';
  isHotel:boolean = false;
  uploadUrl = "";
  number = "[0-9_-]{1,15}";

  isFacility:boolean = false;

  imageUploadUrl = '';

  basicInfoData:object = [];
  hotelTypes:any = [];
  submitError:string = '';
  formId = '';
  room_id = '';
  countryCode:any = '+92';
  countriesList:any = [];
  languagesList:any = [];
  breakfastList:any = [];
  selectedCountryId = '';
  citiesList:object = [];
  propertyDetailsData:object = [];
  isInternet: boolean;
  isInternetPaid: boolean;
  checkInternetAvalibility:any = '';
  isParking: boolean;
  isParkingPaid: boolean;
  checkParkingAvalibility:any = '';
  isBreakfast: boolean;
  isBreakfastPaid: boolean;
  checkBreakfastAvalibility:any = '';
  roomTypeList:any = [];
  // roomFacilities:any = [];
  roomDetailsData:object = [];
  roomFacilitiesData:object = [];
  roomNameList:any = [];
  // insertedRoom: object = [];
  roomMsg:string;
  roomTypeId:any = '';
  insertedRooms:any = [];
  // insertedRoomsList:any = [];

  facilitiesRooms:any = [];

  // orderForm: FormGroup;
  bed_types: FormArray;

  dropdownSettings = {};

  selectedBreakfastTypes = [];
  selectedLanguages = [];
  breakfastOptionsModel: any[];
  languageModel: any[];
  // myOptions= [];

  mainFacility:FormGroup;
  sub:FormGroup;
  roomFacilities:FormGroup;
  showRooms:boolean = false;

  totalRoomsAdded:number = 0
  remainingRooms:number = 0
  totalRoomsToAdd:number;
  totalRoomsInProperty:number;

  hotelImages;

  // room details properties
  roomData:object = [];
  edit_room_id;         
  room_type;       
  room_name;     
  room_number;   
  smooking_policy;
  price_pp_pn;  
  no_of_guests;
  
  // payment form fields
  agree:boolean
  amx:string;
  default_tax:boolean
  is_credit_card:string
  master:boolean
  mestro:string;
  no_pay_vat:boolean
  verify:boolean
  visa:boolean

  roomEditStatus:boolean;
  editForm:boolean = false;
  hotelData:object = [];

  private toasterService: ToasterService;

  @ViewChild('mystepp') mystepp: MatStep;
  @ViewChild('stepper') stepper: MatStepper;

  private _isCompleted: string;

  constructor(private _formBuilder: FormBuilder, private dataService: DataServiceService, 
    private mainService: MainServiceService, private router: Router, toasterService: ToasterService, private route: ActivatedRoute) { 
    this.isInternet = false;
    this.currentUser = jwt_decode(localStorage.getItem('currentUser'));
    this.toasterService = toasterService;
    this.route.paramMap.subscribe(param => {
      if(param.get('id')) {
        this.editForm = true;
      }
      this.formId = param.get('id');
    })
  }

  ngOnInit() {
    
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    // get hotel types list
    this.dataService.getData(this.mainService.url+'HotelLists/hotelPropertyType')
    .subscribe((data) => {
      this.hotelTypes = data
    });
    // get Countries list
    this.dataService.getData(this.mainService.url+'HotelLists/countries')
    .subscribe((data) => {
      this.countriesList = data
    });

    // get Languages list
    this.dataService.getData(this.mainService.url+'HotelLists/languages')
    .subscribe((data) => {
      this.languagesList = data
    });

    // get breakfast Types
    this.dataService.getData(this.mainService.url+'HotelLists/breakfastType')
    .subscribe((data) => {
      this.breakfastList = data
    });

    // get Room Types
    this.dataService.getData(this.mainService.url+'HotelLists/roomType')
    .subscribe((data) => {
      this.roomTypeList = data
    });

    this.basicInfoForm = this._formBuilder.group({
      property_types: ['', Validators.required],
      name: ['', Validators.required],
      total_rooms: ['', Validators.required],
      star_rating: ['', ''],
      contact_name: ['', Validators.required],
      country_code: ['', Validators.required],
      phone_no: ['',Validators.compose([ Validators.required, Validators.minLength(7) ])],
      country_id: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      zip_code: ['','']
    });
    
    this.propertyDetailsForm = this._formBuilder.group({
      internet_availability: ['', Validators.required],
      internet_type: ['', ''],
      internet_range: ['', ''],
      internet_price_per_day: ['', ''],
      parking_availability: ['', Validators.required],
      parking_type: ['', ''],
      parking_location: ['', ''],
      parking_reservation: ['', ''],
      parking_price_per_day: ['', ''],
      breakfast: ['', Validators.required],
      breakfast_price: ['', ''],
      breakfast_type: ['', ''],
      language_id: ['', ''],
      // facilities: ['', '']
    });

    this.roomDetailsForm = this._formBuilder.group({
      room_type: ['', Validators.required],
      room_name: ['', Validators.required],
      room_number: ['', Validators.required],
      smooking_policy: ['', Validators.required],
      price_pp_pn: ['', Validators.required],
      no_of_guests: ['', Validators.required],
      bed_types: this._formBuilder.array([ this.createItem() ])
    });

    // create Amenities form
    this.createAmenitiesForm('');
    
    this.policyForm = this._formBuilder.group({
      cancellation_days: ['', Validators.required],
      cancellation_charges: ['', Validators.required],
      checkin_from: ['', Validators.required],
      checkin_to: ['', Validators.required],
      checkout_from: ['', Validators.required],
      checkout_to: ['', Validators.required],
    });  
    
    // this.paymentsForm = this._formBuilder.group({
    //   is_credit_card: ['', ''],
    //   credit_card: new FormArray([]),
    // });

    // get form data for edit 
    this.hotelFormsEdit();

  } // onInit

  public get isCompleted(): string { 
    if(this.mystepp == undefined)
      return "ud";
    else
      return this.mystepp.completed ? "Completed" : "Not completed";
   }

   ngAfterViewInit() {
      // this.stepper.selectedIndex = 1; 
  }
  
  hotelFormsEdit(){
    if(this.editForm == true){
      this.isLinear = false;
      this.dataService.getData(this.mainService.url+'HotelLists/editHotel/'+this.formId)
      .subscribe(res => {
        console.log('hotel data',res);
        this.hotelData = res;
        this.selectedCountryId = this.hotelData['country_id']; // get selected country id to generate cities list
        this.getCitiesList(); // get cities list against country id
        this.totalRoomsToAdd = this.hotelData['total_rooms'] // set hotel total rooms
        // set values to basic info form
        this.basicInfoForm.setValue({
          property_types: this.hotelData['property_types'],
          name: this.hotelData['name'],
          total_rooms: this.hotelData['total_rooms'],
          star_rating: this.hotelData['star_rating'],
          contact_name: this.hotelData['contact_name'],
          country_code: '+92',
          phone_no: this.hotelData['phone_no'],
          address: this.hotelData['address'],
          country_id: this.hotelData['country_id'],
          city: this.hotelData['city'],
          zip_code: this.hotelData['zip_code']
        });

        this.checkInternetAvalibility = this.hotelData['internet_availability']; // set internet avalibility option to show sub fields
        this.internetAvalibility(); // show sub fields for internet avalibility
        this.checkParkingAvalibility = this.hotelData['parking_availability']; // set parking availibility option to show sub fields
        this.parkingAvalibility(); // show sub fields for parking availibility
        this.checkBreakfastAvalibility = this.hotelData['breakfast']; // set breakfast option to show sub fields
        this.breakfastAvalibility(); // show breakfast sub fields;
        // this.languageModel = JSON.parse(this.hotelData['language_id']);
        // console.log('languages',this.languageModel)
        this.breakfastOptionsModel = JSON.parse(this.hotelData['breakfast_type']);
        console.log('breakfast',this.breakfastOptionsModel)
        // set values to property details form
        this.propertyDetailsForm.setValue({
          internet_availability: this.hotelData['internet_availability'],
          internet_type: this.hotelData['internet_type'],
          internet_range: this.hotelData['internet_range'],
          internet_price_per_day: this.hotelData['internet_price_per_day'],
          parking_availability: this.hotelData['parking_availability'],
          parking_type: this.hotelData['parking_type'],
          parking_location: this.hotelData['parking_location'],
          parking_reservation: this.hotelData['parking_reservation'],
          parking_price_per_day: this.hotelData['parking_price_per_day'],
          breakfast: this.hotelData['breakfast'],
          breakfast_price: this.hotelData['breakfast_price'],
          breakfast_type: '',
          language_id: ''
        });

        // set values to room details form
        this.insertedRooms = this.hotelData['room_details'];
        console.log('inserted rooms in hotel edit',this.insertedRooms)
        this.insertedRooms.forEach(item => {
          this.totalRoomsAdded += +item.room_number;
        });
        this.totalRoomsToAdd = this.totalRoomsToAdd - this.totalRoomsAdded;
        this.changeRoomsFormValidations();
        // this.insertedRooms = []
        if(this.totalRoomsToAdd == 0){
          // this.getAmenitiesFormData();
          this.createAmenitiesForm(this.hotelData['all_facility'],this.hotelData['extra_bed']);
        }

        // room facilities
        // this.amenitiesForm.setValue({
        //   formId: this.formId,
        //   extra_bed: this.hotelData['extra_bed'],
        //   mainFacility: this._formBuilder.array(this.hotelData['all_facility'])
        // })

        // PHOTOS GET
        this.getHotelImages(this.formId);

        // image upload url
        this.imageUploadUrl = this.mainService.url+'/hotelLists/uploadePic/'+this.formId+'';
        
        // this.createAmenitiesForm(this.hotelData['all_facility']);

        // policies form
        this.policyForm.setValue({
          cancellation_days: this.hotelData['cancellation_days'],
          cancellation_charges: this.hotelData['cancellation_charges'],
          checkin_from: this.hotelData['checkin_from'].slice(0,5),
          checkin_to: this.hotelData['checkin_to'].slice(0,5),
          checkout_from: this.hotelData['checkout_from'].slice(0,5),
          checkout_to: this.hotelData['checkout_to'].slice(0,5),
        });

        // payment form 
        this.is_credit_card = this.hotelData['payment_mothods']['payment_form']['is_credit_card'];
        this.visa = this.hotelData['payment_mothods']['payment_form']['visa'];
        this.master = this.hotelData['payment_mothods']['payment_form']['master'];
        this.mestro = this.hotelData['payment_mothods']['payment_form']['mestro'];
        this.amx = this.hotelData['payment_mothods']['payment_form']['amx'];
        this.default_tax = this.hotelData['payment_mothods']['payment_form']['default_tax'];
        this.no_pay_vat = this.hotelData['payment_mothods']['payment_form']['no_pay_vat'];
        this.verify = this.hotelData['payment_mothods']['payment_form']['verify'];
        this.agree = this.hotelData['payment_mothods']['payment_form']['agree'];
        
      });
    }
  }

  onBreakfastSelect(item: any) {
    this.selectedBreakfastTypes.push(item);
    this.selectedBreakfastTypes.pop();
  }
  onSelectAllBreakfast(items: any) {
      this.selectedBreakfastTypes = items;
  }

  onLanguageSelect(item: any) {
    this.selectedLanguages.push(item);
    this.selectedLanguages.pop();
  }
  onSelectAllLanguages(items: any) {
      this.selectedLanguages = items;
  }

  // get hotel images
  getHotelImages(id) {
    this.dataService.getData(this.mainService.url+'HotelLists/getImages/'+id)
      .subscribe(res => {
        let imgObj = JSON.stringify(res).replace(/\\/g, "");
        this.hotelImages =  JSON.parse(imgObj) || '';
        console.log(this.hotelImages)
    });
    return this.hotelImages;
  }
  
  // create bed types form
  createItem(): FormGroup {
    return this._formBuilder.group({
      bed_type: [''],
      number_of_beds: ['']
    });
  }

  // add new row to bed types form
  addItem(): void {
    this.bed_types = this.roomDetailsForm.get('bed_types') as FormArray;
    this.bed_types.push(this.createItem());
  }

  // remove row form bed types form
  removeItem(index): void {
    if(index > 0) {
      this.bed_types = this.roomDetailsForm.get('bed_types') as FormArray;
      this.bed_types.removeAt(index);
    } 
  }

  // get room Facilities
  getAmenitiesFormData() {
    this.dataService.getData(this.mainService.url+'HotelLists/roomFacilities')
    .subscribe((data) => {
      console.log(data)
      this.createAmenitiesForm(data)
    });
  }

  // create room facilities form
  createAmenitiesForm(formData,extra_bed?) {
    let fac_arr = [];
    for(let i = 0; i < formData.length; i++){
      fac_arr.push(this.mainFacilities(formData[i]));
    }
    this.amenitiesForm = this._formBuilder.group({
      formId: [this.formId],
      extra_bed: [extra_bed, Validators.required],
      mainFacility: this._formBuilder.array(fac_arr)
    })
  }
  
  // list main facilities in form
  mainFacilities(formData): FormGroup {
    let sub_arr = [];
    for(let i = 0; i < formData.sub.length; i++){
      sub_arr.push(this.subFacility(formData.sub[i]));
    }
    return this._formBuilder.group({
      id: [formData.id],
      name: [formData.name],
      sub: this._formBuilder.array(sub_arr)
    })
  }

  // list sub facilities in form
  subFacility(subData): FormGroup {
    let roomsFac = [];
    if(this.editForm == true){
      this.facilitiesRooms = subData.roomFacilities;
    } else {
      this.facilitiesRooms = this.insertedRooms;
    }
    for(let i = 0; i < this.facilitiesRooms.length; i++){
      roomsFac.push(this.roomFacility(this.facilitiesRooms[i]));
    }
    // convert string value to boolean
    var checkValue = subData.value == 'true' ? true : false;
    var options = subData.option == null || subData.option == "null" ? 1 : subData.option;
    return this._formBuilder.group({
      id: [subData.id],
      name: [subData.name],
      value:[checkValue, Validators.required],
      option: [options],
      roomOpt:[checkValue],
      roomFacilities: this._formBuilder.array(roomsFac)
    })
  }

  // create room list for facilities
  roomFacility(roomFac): FormGroup {
    let roomValue = roomFac.value == "true" ? 1 : 0;
    return this._formBuilder.group({
      id: [roomFac.id],
      name: [roomFac.room_name],
      value: [roomValue]
    })
  }

  scroll(el) {
      el.scrollIntoView();
  }
  
  onActivate = function(event){
    window.scroll(0,0);
  }

  // get Cities list
  getCitiesList() {
    this.dataService.postData(this.mainService.url+'HotelLists/cities',{'country_id':this.selectedCountryId})
    .subscribe((data) => {
      this.citiesList = data
    });
  }

  // get room Names
  getRoomNames() {
    return this.dataService.postData(this.mainService.url+'HotelLists/roomName',{id: this.roomTypeId})
    .subscribe((data) => {
      this.roomNameList = data
    });
  }

  // check if rooms selected is equal to total rooms to add
  checkRoomsCount(rooms){
    if(rooms > this.totalRoomsToAdd){
      this.roomDetailsForm.get('room_number').markAsDirty();
      this.toasterService.pop('warning', 'Warning', `You cannot add more than ${this.totalRoomsToAdd} Rooms`);
    } else {
      this.roomDetailsForm.get('room_number').markAsPristine();
    }
  }

  // calculate number of rooms to add
  countSelectedRooms(roomNo) {
    if(this.totalRoomsToAdd == this.totalRoomsAdded){
      this.totalRoomsToAdd = this.totalRoomsAdded - roomNo;
    } else {
      this.totalRoomsToAdd = this.totalRoomsToAdd - roomNo;
    }
  }

  // change form validations if total rooms are added
  changeRoomsFormValidations(){
    if (this.totalRoomsToAdd == 0) {
      this.roomDetailsForm.get('room_type').setValidators(null)
      this.roomDetailsForm.get('room_name').setValidators(null)
      this.roomDetailsForm.get('room_number').setValidators(null)
      this.roomDetailsForm.get('smooking_policy').setValidators(null)
      this.roomDetailsForm.get('price_pp_pn').setValidators(null)
      this.roomDetailsForm.get('no_of_guests').setValidators(null)
    } else {
      this.roomDetailsForm.get('room_type').setValidators(Validators.required)
      this.roomDetailsForm.get('room_name').setValidators(Validators.required)
      this.roomDetailsForm.get('room_number').setValidators(Validators.required)
      this.roomDetailsForm.get('smooking_policy').setValidators(Validators.required)
      this.roomDetailsForm.get('price_pp_pn').setValidators(Validators.required)
      this.roomDetailsForm.get('no_of_guests').setValidators(Validators.required)
    }
    this.roomDetailsForm.get('room_type').updateValueAndValidity()
    this.roomDetailsForm.get('room_name').updateValueAndValidity()
    this.roomDetailsForm.get('room_number').updateValueAndValidity()
    this.roomDetailsForm.get('smooking_policy').updateValueAndValidity()
    this.roomDetailsForm.get('price_pp_pn').updateValueAndValidity()
    this.roomDetailsForm.get('no_of_guests').updateValueAndValidity()
  }

  // countCheckbox(tags, i) {
  //   if (tags) {
  //     this.tags[i].checked = !this.tags[i].checked;
  //   }
  // }

  // show star raiting and change validatior if property type is hotel
  showRaiting() {
    if(this.selectedPropertyType == '2') {
      this.isHotel = true;
      this.basicInfoForm.get('star_rating').setValidators(Validators.required);
    } else {
      this.isHotel = false;
      this.basicInfoForm.get('star_rating').setValidators(null);
    }
    this.basicInfoForm.get('star_rating').updateValueAndValidity();
  }

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }

  // add hotel basic info
  addBasicInfo = function(data){
    if(this.basicInfoForm.valid){
      this.basicInfoData = {
        'form_id'       : this.formId, 
        'property_types': data.property_types,
        'name'          : data.name,
        'total_rooms'   : data.total_rooms,
        'star_rating'   : data.star_rating,
        'contact_name'  : data.contact_name,
        'phone_no'      : data.country_code+ +data.phone_no,
        'address'       : data.address,
        'country_id'    : data.country_id,
        'city'          : data.city,
        'zip_code'      : data.zip_code,
        'created_by'    : this.currentUser.id
      }
      if(this.formId == ""){
        return this.dataService.postData(this.mainService.url+'HotelLists/insertNewHotel',JSON.stringify(this.basicInfoData))
        .subscribe(res => {
          this.totalRoomsToAdd = this.basicInfoData.total_rooms;
          // this.totalRoomsToAdd = this.totalRoomsAdded;
          this.formId = res.id;
          this.imageUploadUrl = this.mainService.url+'/hotelLists/uploadePic/'+res.id+'';
          this.toasterService.pop('success', 'Success', 'Basic Info Added.');
          console.log('if',this.formId);
        });
      } else {
        return this.dataService.postData(this.mainService.url+'HotelLists/insertNewHotel/',this.basicInfoData)
        .subscribe(res => {
          this.formId = res.id;
          this.totalRoomsToAdd = this.basicInfoData.total_rooms - this.totalRoomsAdded;
          this.imageUploadUrl = this.mainService.url+'/hotelLists/uploadePic/'+res.id+'';
          this.toasterService.pop('success', 'Success', 'Basic Info Updated.');
          this.changeRoomsFormValidations();
          console.log('else',this.formId);
        });
      }
      
    } else {
      this.toasterService.pop('error', 'Error', 'Please Fill All Required Fields.');
      this.submitError = 'Please Fill All Required Fields';
      this.basicInfoForm.controls['property_types'].markAsTouched();
      this.basicInfoForm.controls['name'].markAsTouched();
      this.basicInfoForm.controls['total_rooms'].markAsTouched();
      this.basicInfoForm.controls['star_rating'].markAsTouched();
      this.basicInfoForm.controls['contact_name'].markAsTouched();
      this.basicInfoForm.controls['country_code'].markAsTouched();
      this.basicInfoForm.controls['phone_no'].markAsTouched();
      this.basicInfoForm.controls['address'].markAsTouched();
      this.basicInfoForm.controls['country_id'].markAsTouched();
      this.basicInfoForm.controls['city'].markAsTouched();
    }
      
  }

  // check if internet is available
  internetAvalibility(): void {
    if(this.checkInternetAvalibility == 'Yes, Free'){
      this.isInternet = true;
      this.isInternetPaid = false;
      this.propertyDetailsForm.get('internet_type').setValidators(Validators.required);
      this.propertyDetailsForm.get('internet_range').setValidators(Validators.required);
      this.propertyDetailsForm.get('internet_price_per_day').setValidators(null);
    } else if(this.checkInternetAvalibility == 'Yes, Paid'){
      this.isInternet = true;
      this.isInternetPaid = true;
      this.propertyDetailsForm.get('internet_type').setValidators(Validators.required);
      this.propertyDetailsForm.get('internet_range').setValidators(Validators.required);
      this.propertyDetailsForm.get('internet_price_per_day').setValidators(Validators.required);
    } else {
      this.isInternet = false;
      this.isInternetPaid = false;
      this.propertyDetailsForm.get('internet_type').setValidators(null);
      this.propertyDetailsForm.get('internet_range').setValidators(null);
      this.propertyDetailsForm.get('internet_price_per_day').setValidators(null);
    }
    this.propertyDetailsForm.get('internet_type').updateValueAndValidity();
    this.propertyDetailsForm.get('internet_range').updateValueAndValidity();
    this.propertyDetailsForm.get('internet_price_per_day').updateValueAndValidity();
  }

  // check if parking is available
  parkingAvalibility(): void {
    if(this.checkParkingAvalibility == 'Yes, Free'){
      this.isParking = true;
      this.isParkingPaid = false;
      this.propertyDetailsForm.get('parking_type').setValidators(Validators.required)
      this.propertyDetailsForm.get('parking_location').setValidators(Validators.required)
      this.propertyDetailsForm.get('parking_reservation').setValidators(Validators.required)
      this.propertyDetailsForm.get('parking_price_per_day').setValidators(null)
    } else if(this.checkParkingAvalibility == 'Yes, Paid'){
      this.isParking = true;
      this.isParkingPaid = true;
      this.propertyDetailsForm.get('parking_type').setValidators(Validators.required)
      this.propertyDetailsForm.get('parking_location').setValidators(Validators.required)
      this.propertyDetailsForm.get('parking_reservation').setValidators(Validators.required)
      this.propertyDetailsForm.get('parking_price_per_day').setValidators(Validators.required)
    } else {
      this.isParking = false;
      this.isParkingPaid = false;
      this.propertyDetailsForm.get('parking_type').setValidators(null)
      this.propertyDetailsForm.get('parking_location').setValidators(null)
      this.propertyDetailsForm.get('parking_reservation').setValidators(null)
      this.propertyDetailsForm.get('parking_price_per_day').setValidators(null)
    }
    this.propertyDetailsForm.get('parking_type').updateValueAndValidity()
    this.propertyDetailsForm.get('parking_location').updateValueAndValidity()
    this.propertyDetailsForm.get('parking_reservation').updateValueAndValidity()
    this.propertyDetailsForm.get('parking_price_per_day').updateValueAndValidity()
  }

  // check if breakfast is available
  breakfastAvalibility(): void {
    if(this.checkBreakfastAvalibility == 'Yes, Its Optional'){
      this.isBreakfast = true;
      this.isBreakfastPaid = true;
      this.propertyDetailsForm.get('breakfast_price').setValidators(Validators.required)
      this.propertyDetailsForm.get('breakfast_type').setValidators(Validators.required)
    } else if(this.checkBreakfastAvalibility == 'Yes, Included in Price') {
      this.isBreakfast = true;
      this.isBreakfastPaid = false;
      this.propertyDetailsForm.get('breakfast_price').setValidators(null)
      this.propertyDetailsForm.get('breakfast_type').setValidators(Validators.required)
    } else {
      this.isBreakfast = false;
      this.isBreakfastPaid = false;
      this.propertyDetailsForm.get('breakfast_price').updateValueAndValidity()
      this.propertyDetailsForm.get('breakfast_type').updateValueAndValidity()
    }
  }

  imageFinishedUploading(file) {
    // this.getHotelImages(this.formId);
    this.toasterService.pop('success', 'Success', 'Image Uploaded.');
  }
  
  // image remove 
  onRemoved(file) {
    console.log(file)
    let body = JSON.parse(file.serverResponse._body);
    let id = body.hotel_image_id;
    this.dataService.deleteData(this.mainService.url+'HotelLists/deleteImage/'+id).subscribe(res => {
      console.log(res)
      // this.getHotelImages(this.formId);
      this.toasterService.pop('success', 'Success', 'Image Deleted..');
    })
  }
  
  // image upload status change
  onUploadStateChanged(state) {
  }

  imageUploadChange() {
    console.log('change');
    return this.dataService.postData(this.mainService.url+'HotelLists/uploadePic',JSON.stringify({form_id : this.formId}))
      .subscribe(res => {
        console.log(res);
      });
  }

  // add property details
  addPropertyDetails = function(data){
    if(this.propertyDetailsForm.valid){
      this.propertyDetailsData = {
        'form_id'                 : this.formId, 
        'internet_availability'   : data.internet_availability,
        'internet_type'           : data.internet_type,
        'internet_range'          : data.internet_range,
        'internet_price_per_day'  : data.internet_price_per_day,
        'parking_availability'    : data.parking_availability,
        'parking_type'            : data.parking_type,
        'parking_location'        : data.parking_location,
        'parking_reservation'     : data.parking_reservation,
        'parking_price_per_day'   : data.parking_price_per_day,
        'breakfast'               : data.breakfast,
        'breakfast_price'         : data.breakfast_price,
        'breakfast_type'          : data.breakfast_type,
        'language_id'             : data.language_id,
        'facilities'              : data.facilities
      }
      // console.log(this.propertyDetailsData);
      return this.dataService.postData(this.mainService.url+'HotelLists/insertPropertyDetails',JSON.stringify(this.propertyDetailsData))
      .subscribe(res => {
        console.log(res);
        console.log('form id' + this.formId)
        // this.formId = res.id;
        this.toasterService.pop('success', 'Success', 'Property Details Added.');
      });
      
    } else {
      this.toasterService.pop('error', 'Error', 'Please Fill All Required Fields.');
      this.submitError = 'Please Fill All Required Fields';
      this.propertyDetailsForm.controls['internet_availability'].markAsTouched();
      this.propertyDetailsForm.controls['internet_type'].markAsTouched();
      this.propertyDetailsForm.controls['internet_range'].markAsTouched();
      this.propertyDetailsForm.controls['internet_price_per_day'].markAsTouched();
      this.propertyDetailsForm.controls['parking_availability'].markAsTouched();
      this.propertyDetailsForm.controls['parking_type'].markAsTouched();
      this.propertyDetailsForm.controls['parking_location'].markAsTouched();
      this.propertyDetailsForm.controls['parking_reservation'].markAsTouched();
      this.propertyDetailsForm.controls['parking_price_per_day'].markAsTouched();
      this.propertyDetailsForm.controls['breakfast'].markAsTouched();
      this.propertyDetailsForm.controls['language_id'].markAsTouched();
    }
  }

  // add or update room details
  addRoomDetails = function(data){
    // console.log(data);
    if(this.totalRoomsToAdd - +data.room_number < 0){
      this.toasterService.pop('error', 'Error', 'Please Select Number of Rooms Available!');
      return false
    }
    if(this.roomDetailsForm.valid && this.totalRoomsToAdd >= 0){
      this.roomDetailsData = {
        'form_id'         : this.formId, 
        'room_type'       : data.room_type,
        'room_name'       : data.room_name,
        'room_number'     : data.room_number,
        'smooking_policy' : data.smooking_policy,
        'price_pp_pn'     : data.price_pp_pn,
        'no_of_guests'    : data.no_of_guests,
        'bed_types'       : data.bed_types
      }
      
      // check if room id is not empty then update room else add new room
      if(this.edit_room_id != "" && this.edit_room_id != undefined){
        return this.dataService.putData(this.mainService.url+'HotelLists/updateRoom/'+this.edit_room_id,this.roomDetailsData)
        .subscribe(res => {
          this.totalRoomsAdded = 0;
          if(res['data'] != null){
            res['data'].forEach(item => {
              this.totalRoomsAdded += +item.room_number;
            });
          } else {
            this.totalRoomsAdded = 0;
          }
          console.log('total rooms to add in update before',this.totalRoomsToAdd);
          this.totalRoomsToAdd = this.basicInfoForm.get('total_rooms').value - this.totalRoomsAdded; // org
          // this.totalRoomsToAdd = this.totalRoomsToAdd - this.totalRoomsAdded;
          console.log('total rooms to add after updare',this.totalRoomsToAdd)
          this.roomDetailsForm.reset();
          this.bed_types = [];
          this.getAmenitiesFormData();
          this.toasterService.pop('success', 'Success', 'Room Details Updated');
          this.insertedRooms = res['data']
          this.changeRoomsFormValidations();
          this.roomEditStatus = false;
          console.log('inserted rooms in update',this.insertedRooms)
        }),
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
        };
      } else {
        return this.dataService.postData(this.mainService.url+'HotelLists/insertRoomDetails',JSON.stringify(this.roomDetailsData))
        .subscribe(res => {
          this.room_id = res.room_id;
          this.bed_types = [];
          this.insertedRooms = res.data;
          this.countSelectedRooms(data.room_number)
          this.changeRoomsFormValidations();
          this.roomMsg = 'Room Type Inserted.';
          this.roomDetailsForm.reset();
          this.getAmenitiesFormData();
          this.toasterService.pop('success', 'Success', 'Room Details Added.');
        });
      }
    } else {
      this.toasterService.pop('error', 'Error', 'Please Fill All Required Fields');
      this.submitError = 'Please Fill All Required Fields';
      this.roomDetailsForm.controls['room_type'].markAsTouched();
      this.roomDetailsForm.controls['room_name'].markAsTouched();
      this.roomDetailsForm.controls['room_number'].markAsTouched();
      this.roomDetailsForm.controls['smooking_policy'].markAsTouched();
      this.roomDetailsForm.controls['price_pp_pn'].markAsTouched();
    }
  }

  editRoom(id) {
    this.roomEditStatus = true;
    // reset value of total rooms left to add
    this.totalRoomsToAdd = this.editForm == true ? this.hotelData['total_rooms'] : this.basicInfoForm.get('total_rooms').value;
    console.log('total rooms to add',this.totalRoomsToAdd)
    this.totalRoomsAdded = 0
    console.log('inserted rooms in edit',this.insertedRooms)
    this.insertedRooms.forEach(item => {
      this.totalRoomsAdded += +item.room_number;
    });
    this.totalRoomsToAdd = this.totalRoomsToAdd - this.totalRoomsAdded;
    this.dataService.getData(this.mainService.url+'HotelLists/singleRoom?id='+id)
      .subscribe(res => {
        this.edit_room_id = res['id'];         
        this.roomTypeId = res['room_type']; 
        this.room_type = res['room_type'];      
        this.room_name = res['room_name'];     
        this.room_number = res['room_number'];   
        this.smooking_policy = res['smooking_policy'];
        this.price_pp_pn = res['price_pp_pn'];  
        this.no_of_guests = res['no_of_guest'];   
        this.bed_types = res['bed_type']; 
        // update total rooms added
        this.totalRoomsToAdd = this.totalRoomsToAdd + +res['room_number'];
        this.getRoomNames();
      })

  }

  discardRoomEdit(room_id,room_number){
    this.edit_room_id = '';
    this.totalRoomsToAdd = this.totalRoomsToAdd - room_number;
    this.roomDetailsForm.reset();
    this.roomEditStatus = false;
  }

  deleteRoom(id){
    this.dataService.deleteData(this.mainService.url+'HotelLists/deleteRoom/'+id).subscribe(res => {
      this.insertedRooms = res['data']
      console.log('inserted rooms in delete',this.insertedRooms)
      this.totalRoomsAdded = 0;
      if(res['data'] != null){
        res['data'].forEach(item => {
          this.totalRoomsAdded += +item.room_number;
        });
      } else {
        this.totalRoomsAdded = 0;
      }
      this.totalRoomsToAdd = this.basicInfoForm.get('total_rooms').value - this.totalRoomsAdded;
      this.toasterService.pop('success', 'Success', 'Room Deleted');
    })
  }

  addRoomFacilities = function(data){
    console.log(this.amenitiesForm.value);
    this.roomFacilitiesData = data;
    console.log(data);
    this.dataService.postData(this.mainService.url+'HotelLists/insertRoomFacility',JSON.stringify(this.roomFacilitiesData))
      .subscribe(res => {
        console.log(res);
        console.log('form id' + this.formId);
        this.toasterService.pop('success', 'Success', 'Room Facilities Added');
      });
  }

  deleteImage(id){
    this.dataService.deleteData(this.mainService.url+'HotelLists/deleteImage/'+id).subscribe(res => {
      console.log(res)
      this.getHotelImages(this.formId);
      this.toasterService.pop('success', 'Success', 'Image Deleted..');
    })
  }

  addPolicies = function(data){
    if(this.policyForm.valid){
      this.policyData = {
        'form_id'         : this.formId, 
        'cancellation_days'       : data.cancellation_days,
        'cancellation_charges'       : data.cancellation_charges,
        'checkin_from'     : data.checkin_from,
        'checkin_to' : data.checkin_to,
        'checkout_from'     : data.checkout_from,
        'checkout_to'     : data.checkout_to
      }
      console.log(this.policyData);
      return this.dataService.postData(this.mainService.url+'HotelLists/policy',JSON.stringify(this.policyData))
      .subscribe(res => {
        console.log(res.room_id);
        console.log('form id' + this.formId);
        this.toasterService.pop('success', 'Success', 'Room Policies Added');
      });
      
    } else {
      console.log('else');
      this.toasterService.pop('error', 'Error!', 'Please Fill All Required Fields.');
      this.submitError = 'Please Fill All Required Fields';
      this.policyForm.controls['cancellation_days'].markAsTouched();
      this.policyForm.controls['cancellation_charges'].markAsTouched();
      this.policyForm.controls['checkin_from'].markAsTouched();
      this.policyForm.controls['checkin_to'].markAsTouched();
      this.policyForm.controls['checkout_from'].markAsTouched();
      this.policyForm.controls['checkout_to'].markAsTouched();
    }
  }

  addHotelPayment = function(data){
    console.log(data);
   
      this.paymentData = {
        'form_id'         : this.formId, 
        'payment_form'    : data
      }
      console.log(this.policyData);
      return this.dataService.postData(this.mainService.url+'HotelLists/payment',JSON.stringify(this.paymentData))
      .subscribe(res => {
        this.router.navigate(['/hotelPreview', this.formId]);
        this.toasterService.pop('success', 'Success', 'Room Payment Added');
      });
  }

} // /class
