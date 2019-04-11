// import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../../../services/data-service.service';
import { MainServiceService } from '../../../services/main.service';
import { ActivatedRoute } from '@angular/router';
import { NavigationExtras } from '@angular/router/src/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as visa_options from '../../../../assets/visa_options.json';
import { User } from '../../../models/index';
import * as jwt_decode from 'jwt-decode';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
// import * as fss from 'fs';

@Component({
	selector: 'app-visa-details',
	templateUrl: './visa-details.component.html',
	styleUrls: ['./visa-details.component.css']
})
export class VisaDetailsComponent implements OnInit {
	currentUser: User;

	constructor(private route: ActivatedRoute, private dataService: DataServiceService,
		private mainService: MainServiceService, private _fBuild: FormBuilder, private http: Http, private _httpClient: HttpClient) {
		// Get Current Login UserId
		this.currentUser = jwt_decode(localStorage.getItem('currentUser')).id;
	}

	backPage: string = "/visa";
	backPageTitle: string = "Visa";
	params: any;
	visaId: number;
	visaDetailId: number;
	edtVisaForm: FormGroup;
	edtVisaFormParams: object;
	visaDetails: any;
	visaCountryName: string = '';
	visaCountryDetails: any;
	visaTypeName: any = [];
	visaDurationName: any = [];
	visaNumEntry: any = [];
	docRequired: any = [];
	visaDetail: any;
	visaTypeLists: any;
	visaDurationsList: any;
	visaValidityList:any;
	visaNumEntryList: any;
	documentsRequired = [];
	selectedDocuments = [];
	_isVisaPrice = -1;
	_isCmsVisa: boolean = false;
	visaIncludes = [];
	dropdownSettings = {};
	selectedItems = [];
	// Initialize Form
	edtVisaDetailsFrm: FormGroup;
	visaCurrenciesList: any;
	visaPriceFormParams: object;
	// Create Switch Statement
	visaDetailsSwitch: string;
	viewVisaDetails :object = {
		'visaUrl' : '',
		'details' : '',
		'status' : '',
	}
	// Get Client IP Address and Country
	getCountryIpAddress() {
	  this.dataService.getClientInfo('https://ipinfo.io/json')
		.subscribe(resp => {
		  console.log('IP Info:',resp);
		  console.log('IP:', resp.ip);
		  console.log('Country:',resp.country)
		},
		error => { console.log('error', error) });
	}

	ngOnInit() {	
		this.getCountryIpAddress();	
		this.dataService.getVisaOptions().subscribe(res=>{
			this.visaCurrenciesList = res['worldCurrencies'];
			this.visaIncludes = res['visaIncludes'];
			this.visaTypeLists = res['visaTypes'];
			this.visaNumEntryList = res['numOfEntries'];
			this.documentsRequired = res['visaDocuments'];
			this.visaDurationsList = res['visaDurations'];
			this.visaValidityList = res['visaValidities'];
		});
		this.dropdownSettings = {
			singleSelection: false,
			idField: 'item_id',
			textField: 'item_text',
			selectAllText: 'Select All',
			unSelectAllText: 'UnSelect All',
			itemsShowLimit: 1,
			allowSearchFilter: true
		};
		// Get URL Parameter Id
		this.params = this.route.params.subscribe(params => {
			// console.log('param : '+(params['id']));
			this.visaId = params['id']; // (+) converts string 'id' to a number
			this._getCmsVisaDetails();
		});
		// this.dataService.getData(this.mainService.url + 'Cms/createJsonFile').subscribe(res => {
		// 	console.log(res);
		// });
	}
	_getCmsVisaDetails() {
		this.dataService.getData(this.mainService.url + 'Cms/viewVisaDetails/' + this.visaId)
			.subscribe(res => {
				this.visaDetails = res.data;
				this.viewVisaDetails = res.data[0];
				// this.visaCountryName = res.data['0']['countryName'];
				// this.visaCountryDetails = res.data['0']['details'];
				// Remove Duplicate Documents and Get Only Unique Required Documents
				for (var key in res.data) {
					let doc_required = res.data[key]['docRequired'];
					for (let txt of doc_required) {
						if (typeof txt['item_text'] !== "undefined") {
							this.pushUniqueItem(txt);
						}
					}
				}
			});
	}

	pushUniqueItem(item: any) {
		var index = this.docRequired.findIndex(res => res.item_id === item.item_id);
		if (index > -1) {
			// Some Code Here
		} else {
			this.docRequired.push(item);
		}
	}
	// Update Visa
	updateVisa(evt, edtColumn, dbColumn) {
		this._isCmsVisa = true;
		this.edtVisaForm = this._fBuild.group({
			details: ['', Validators.required]
		});
		this.edtVisaForm.controls['details'].setValue(dbColumn);
	}
	closeEdtVisaForm(event) {
		this._isCmsVisa = false;
	}
	edtCmsVisa(formInputs) {
		if (this.edtVisaForm.valid) {
			this.edtVisaFormParams = {
				'ID': this.visaDetails[0]['visaId'],
				'details': formInputs.details,
				'userId': this.currentUser
			}
			return this.dataService.postData(this.mainService.url + 'Cms/editCmsVisa', this.edtVisaFormParams)
				.subscribe(res => {
					this.edtVisaForm.controls['details'].setValue('');
					this._isCmsVisa = false;
					this._getCmsVisaDetails();
				});
		}
	}
	// Update Visa Details
	updtVisaDetails(evt, index, edtColumn, dbColumn) {
		this._isVisaPrice = index;
		this.visaDetailId = dbColumn.visaDetailId;
		this.visaId = dbColumn.visaId;
		// Check if Form Initialize then Clear Previous Values
		if (this.edtVisaDetailsFrm) {
			this.selectedItems = [];
			this.selectedDocuments = [];
		}

		switch (edtColumn) {
			case "type_duration_entry":
				this.edtVisaDetailsFrm = this.__setVisaTypeDurationEntry();
				this.visaDetailsSwitch = "type_duration_entry";
				this.edtVisaDetailsFrm.controls['durationId'].setValue(dbColumn.durationId);
				this.edtVisaDetailsFrm.controls['visaTypeId'].setValue(dbColumn.visaTypeId);
				this.edtVisaDetailsFrm.controls['numEntries'].setValue(dbColumn.numEntries);
				break;
			case "visaPrice":
				this.edtVisaDetailsFrm = this.__setVisaPriceCurrency();
				this.visaDetailsSwitch = "currency_price";
				this.edtVisaDetailsFrm.controls['currencyCode'].setValue(dbColumn.currencyCode);
				this.edtVisaDetailsFrm.controls['visaPrice'].setValue(dbColumn.visaPrice);
				break;
			case "visaIncludes":
				this.edtVisaDetailsFrm = this.__setVisaIncludes();
				this.visaDetailsSwitch = "visa_includes";
				// this.edtVisaDetailsFrm.controls['visaIncludes'].setValue(dbColumn.visaIncludes);
				this.selectedItems = dbColumn.visaIncludes;
				break;
			case "docRequired":
				this.edtVisaDetailsFrm = this.__setVisaDocRequired();
				this.visaDetailsSwitch = "doc_required";
				this.selectedDocuments = dbColumn.docRequired;
				break;
		}
	}
	// Close Update Form
	closeUpdateVisaPriceForm(evt, index) {
		this._isVisaPrice = -1;
	}

	// Create Visa Type, Duration, No. of Entry, Visa Includes, Visa Price and Currency Code Inputs Functions Start
	__setVisaTypeDurationEntry() {
		return this._fBuild.group({
			visaTypeId: ['', Validators.required],
			durationId: ['', Validators.required],
			numEntries: ['', Validators.required]
		});
	}
	__setVisaPriceCurrency() {
		return this._fBuild.group({
			visaPrice: ['', Validators.required],
			currencyCode: ['', Validators.required]
		});
	}
	__setVisaIncludes() {
		return this._fBuild.group({
			visaIncludes: [[], Validators.required]
		});
	}
	__setVisaDocRequired() {
		return this._fBuild.group({
			docRequired: [[], Validators.required]
		});
	}
	// Create Visa Type, Duration, No. of Entry, Visa Includes, Visa Price and Currency Code Inputs Functions End
	onItemSelect(item: any) {
		this.selectedItems.push(item);
		this.selectedItems.pop();
	}
	onSelectAll(items: any) {
		this.selectedItems = items;
	}
	onDocumentSelect(item: any) {
		this.selectedDocuments.push(item);
		this.selectedDocuments.pop();
	}
	onDocumentSelectAll(items: any) {
		this.selectedDocuments = items;
	}

	// Validate and Update VisaPriceCurrencyForm Values
	edtVisaPriceCurr(formData) {
		// Check Form Fields Validations
		if (this.edtVisaDetailsFrm.valid) {
			this.visaPriceFormParams = {
				'visaId': this.visaId,
				'visaDetailId': this.visaDetailId,
				'visaPrice': formData.visaPrice,
				'currencyCode': formData.currencyCode,
				'visaTypeId': formData.visaTypeId,
				'durationId': formData.durationId,
				'numEntries': formData.numEntries,
				'validityId': formData.validityId,
				'validForCities': JSON.stringify(formData.validForCities),
				'visaIncludes': JSON.stringify(formData.visaIncludes),
				'docRequired': JSON.stringify(formData.docRequired),
			}
			return this.dataService.postData(this.mainService.url + 'Cms/edtSingleVisaDetails', this.visaPriceFormParams)
				.subscribe(res => {
					this._isVisaPrice = -1;
					this.ngOnInit();
				});
		}
	}

	// Get Country Name Against countryId
	// getVisaCountryName(countryId){
	//   // Send CountryId in Post To API
	//   this.dataService.postData(this.mainService.url+'Cms/countryNameById', {"ID": countryId}).subscribe(res => {
	//     return res.data['name'];
	//   });
	// }

}