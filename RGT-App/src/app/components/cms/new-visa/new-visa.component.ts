import { MainServiceService } from './../../../services/main.service';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { DataServiceService } from '../../../services/data-service.service';
import { FormGroup } from '@angular/forms/src/model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Router, ActivatedRoute } from '@angular/router';
import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';
import { User } from '../../../models/index';
import * as jwt_decode from 'jwt-decode';
import * as visa_options from '../../../../assets/visa_options.json';
import { ToasterService } from 'angular2-toaster/src/toaster.service';


@Component({
    selector: 'app-new-visa',
    templateUrl: './new-visa.component.html',
    styleUrls: ['./new-visa.component.css']
})
export class NewVisaComponent implements OnInit {
    currentUser: User

    constructor(private __fb: FormBuilder, private __ds: DataServiceService, private __ms: MainServiceService, private __router: Router,
        private __actRouter: ActivatedRoute, private __toastServ: ToasterService) {
        // Get Current Login UserId
        this.currentUser = jwt_decode(localStorage.getItem('currentUser')).id;
    }

    newVisa: FormGroup;
    // Last Inserted ID (cms_visa), For Updating New Visa Record / Insert New Visa Details (Multiple / More Visa Details)
    newVisaLastId: any;
    // Update Visa Details Record By Id
    visaDetailsId: any;
    newVisaFormData: object;
    // Disable submit button message if form is not validated
    submitBtnErrorMsg: string;
    // Select / Dropdown Lists
    visaTypeLists = [];
    visaNumEntryList = [];
    visaIncludes = [];
    visaCurrenciesList = [];
    selectedItems = [];
    documentsRequired = [];
    selectedDocuments = [];
    validCities = [];
    selectedValidCities = [];
    dropdownSettings = {};
    cities;
    countriesList;
    visaDurationsList;
    visaValidityList;
    // Visa Details Table Columns and Data
    visaDetailsTblColumn: string[];
    visaDetailsTblData: any;
    jsonVisaTypeName: any = [];
    // visaOptionsArr:object;
    params: any;
    imagePreview: any;
    formType: string;
    // // Thumbnail Image Options for Visa
    thumbnailOptions: FancyImageUploaderOptions;

    ngOnInit() {
        this.__ds.getVisaOptions().subscribe(res => {
            this.visaCurrenciesList = res['worldCurrencies'];
            this.visaIncludes = res['visaIncludes'];
            this.visaTypeLists = res['visaTypes'];
            this.visaNumEntryList = res['numOfEntries'];
            this.documentsRequired = res['visaDocuments'];
            this.visaDurationsList = res['visaDurations'];
            this.validCities = res['validCities'];
            this.visaValidityList = res['visaValidities'];
            this.countriesList = res['worldCountries'];
        });
        this.thumbnailOptions = {
            thumbnailHeight: 322,
            thumbnailWidth: 322,
            // uploadUrl: 'http://192.168.5.75:4200/uploads/visas/thumbnails'
            uploadUrl: this.__ms.uploadUrl + "Cms/uploadVisaImg/" + this.newVisaLastId,
        };
        this.visaDetailsTblColumn = ["s#", "Type", "Duration", "Price", ""];
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: true
        };
        // Add Validation to New Visa Form 10-07-2018 11:47 AM
        this.newVisa = this.__fb.group({
            visa_country: ['', Validators.required],
            visaUrl: ['', Validators.required],
            metaTitle:['', Validators.required],
            metaDescription:['', Validators.required],
            visa_type: ['', Validators.required],
            visa_duration: ['', Validators.required],
            no_of_entry: ['', Validators.required],
            visa_validity: ['', Validators.required],
            valid_for_cities: [[]],
            visa_price: ['', Validators.required],
            visa_currency: ['', Validators.required],
            visa_includes: [[], Validators.required],
            document_required: [[], Validators.required],
            shortDescription: ['', Validators.required],
            description: ['', Validators.required],
            status: [''],
        });
        // Get Visa, Visa Details for Update from Visas List Page, Query Parameter ?id=1 etc..
        this.params = this.__actRouter.params.subscribe(params => {
            this.newVisaLastId = this.__actRouter.snapshot.queryParams.id;
        });
        if (this.newVisaLastId) {
            // Thumbnail Image Options for Visa
            // Get Id from URL and Update visaThumbnail field (Insert Image)
            this.thumbnailOptions = {
                thumbnailHeight: 322,
                thumbnailWidth: 322,
                uploadUrl: this.__ms.uploadUrl + "Cms/uploadVisaImg/" + this.newVisaLastId,//'http://192.168.5.75:4200/uploads/visas/thumbnails',
                allowedImageTypes: ['image/png', 'image/jpeg', 'image/jpg'],
                // maxImageSize: 3
            };
            this.__ds.getData(this.__ms.url + 'Cms/viewVisaDetails/?id=' + this.newVisaLastId).subscribe(res => {
                // Set Visa Fields for Update
                this.newVisa.controls['visa_country'].setValue(res.data[0]['countryId']);
                this.newVisa.controls['visaUrl'].setValue(res.data[0]['visaUrl']);
                this.newVisa.controls['metaTitle'].setValue(res.data[0]['metaTitle']);
                this.newVisa.controls['metaDescription'].setValue(res.data[0]['metaDescription']);
                this.newVisa.controls['description'].setValue(res.data[0]['details']);
                this.newVisa.controls['shortDescription'].setValue(res.data[0]['shortDescription']);
                let status=(res.data[0]['status']==1?true :false);
                this.newVisa.controls['status'].setValue(status);
                this.visaDetailsId = res.data[0]['visaDetailId'];
                this.newVisa.controls['visa_type'].setValue(res.data['0']['visaTypeId']);
                this.newVisa.controls['visa_duration'].setValue(res.data['0']['durationId']);
                this.newVisa.controls['visa_validity'].setValue(res.data['0']['validityId']);
                this.newVisa.controls['no_of_entry'].setValue(res.data['0']['numEntries']);
                this.newVisa.controls['visa_price'].setValue(res.data['0']['visaPrice']);
                this.newVisa.controls['visa_currency'].setValue(res.data['0']['currencyCode']);
                this.selectedItems = res.data['0']['visaIncludes'];
                this.selectedDocuments = res.data['0']['docRequired'];
                this.selectedValidCities = res.data['0']['validForCities'];
                this.newVisa.controls['description'].setValue(res.data[0]['details']);
                // Set Visa Details Fields for Updating Record
                this.visaDetailsTblData = res.data;
            });
        }
    } // onInit
    // Upload Visa Thumbnail Image
    onUpload(file: UploadedFile) {
        console.log(file.response);
    }
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
    onValidCitySelect(item: any) {
        this.selectedValidCities.push(item);
        this.selectedValidCities.pop();
    }
    onValidCitySelectAll(items: any) {
        this.selectedValidCities = items;
    }
    scroll(el) {
        el.scrollIntoView();
    }
    onActivate = function (event) {
        window.scroll(0, 0);
    }
    // Get Visa Details By Id to Update Visa Details Record
    getVisaDetailsForUpdt(id) {
        this.visaDetailsId = id;
        this.__ds.postData(this.__ms.url + 'Cms/visaSingleDetail', { "ID": id }).subscribe(res => {
            this.newVisaLastId = res.data['visaId'];
            // Set Visa Fields for Update
            this.newVisa.controls['visa_country'].setValue(res.data['countryId']);
            this.newVisa.controls['visaUrl'].setValue(res.data['visaUrl']);
            this.newVisa.controls['shortDescription'].setValue(res.data['shortDescription']);
            this.newVisa.controls['description'].setValue(res.data['details']);
            this.newVisa.controls['status'].setValue(res.data['status']);
            // Set Visa Details Fields for Updating Record
            this.newVisa.controls['visa_type'].setValue(res.data['visaTypeId']);
            this.newVisa.controls['visa_duration'].setValue(res.data['durationId']);
            this.newVisa.controls['visa_validity'].setValue(res.data['validityId']);
            this.newVisa.controls['no_of_entry'].setValue(res.data['numEntries']);
            this.newVisa.controls['visa_price'].setValue(res.data['visaPrice']);
            this.newVisa.controls['visa_currency'].setValue(res.data['currencyCode']);
            this.selectedItems = res.data['visaIncludes'];
            this.selectedDocuments = res.data['docRequired'];
            this.selectedValidCities = res.data['validForCities'];
        })
    }
    setFormType(action) {
        this.formType = action;
    }
    // Send New Visa Form Data for Insertion / Updation 10-07-2018 11:49 AM
    addNewVisa(formInputs) {
        // Check if all required fields are filled
        if (this.newVisa.valid) {
            this.newVisaFormData = {
                'countryId': formInputs.visa_country,
                'visaUrl': formInputs.visaUrl,
                'file': formInputs.file,
                'metaTitle':formInputs.metaTitle,
                'metaDescription':formInputs.metaDescription,
                'visaId': this.newVisaLastId,
                'ID': this.visaDetailsId,
                'shortDescription': formInputs.shortDescription,
                'details': formInputs.description,
                'status': formInputs.status,
                'visaTypeId': formInputs.visa_type,
                'durationId': formInputs.visa_duration,
                'numEntries': formInputs.no_of_entry,
                'validityId': formInputs.visa_validity,
                'validForCities': JSON.stringify(formInputs.valid_for_cities),
                'visaPrice': formInputs.visa_price,
                'visaIncludes': JSON.stringify(formInputs.visa_includes),
                'docRequired': JSON.stringify(formInputs.document_required),
                'currencyCode': formInputs.visa_currency,
                'createdBy': this.currentUser
            }
            // Post data to desire url using services to Restful API controller 
            return this.__ds.postData(this.__ms.url + 'Cms/insertVisa', this.newVisaFormData)
                .subscribe(res => {
                    this.__toastServ.pop('success', 'Insert / Update', res.message);
                    if (this.formType == 'save_submit') {
                        this.__router.navigate(['/visa']);
                    }
                    this.visaDetailsTblData = res.data;
                    this.newVisaLastId = res['visaId'];
                    // Get Last Id and Update visaThumbnail field (Insert Image)
                    this.thumbnailOptions = {
                        thumbnailHeight: 322,
                        thumbnailWidth: 322,
                        uploadUrl: this.__ms.uploadUrl + "Cms/uploadVisaImg/" + res['visaId'],//'http://192.168.5.75:4200/uploads/visas/thumbnails',
                        allowedImageTypes: ['image/png', 'image/jpeg', 'image/jpg'],
                        // maxImageSize: 3
                    };
                    // Reset Visa Details Fields for Inserting Another Record
                    this.visaDetailsId = '';
                    this.newVisa.controls['visa_type'].setValue('');
                    this.newVisa.controls['visa_validity'].setValue('');
                    this.newVisa.controls['visa_duration'].setValue('');
                    this.newVisa.controls['visa_price'].setValue('');
                    this.newVisa.controls['visa_currency'].setValue('');
                    this.newVisa.controls['no_of_entry'].setValue('');
                    this.selectedItems = [];
                    this.selectedDocuments = [];
                    this.selectedValidCities = [];
                });
        } else {
            this.__toastServ.pop('error', 'Error Info', `Please fill-out all the required fields`);
        }
    }
}
