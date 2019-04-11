import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms/src/model';
import { Observable } from 'rxjs/Observable';
import { Route, ActivatedRoute } from '@angular/router';
import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';
import { MatSelectModule } from '@angular/material/select';
import { DataServiceService } from 'app/services/data-service.service';
import { MainServiceService } from 'app/services/main.service';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { MatTabsModule } from '@angular/material/tabs';
import { Element } from '@angular/compiler';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationExtras, Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import * as visa_options from '../../../../assets/visa_options.json';

@Component({
  selector: 'app-masterlists',
  templateUrl: './masterlists.component.html',
  styleUrls: ['./masterlists.component.css']
})
export class MasterlistsComponent implements OnInit {
  getdurationData: any;
  jsonItemForm: any;
  jsonItemFormData: object;
  formAction: string = 'insert';
  item_id: any;
  visaValidity: any;
  durationData: any;
  validityData: any;
  getvalidityData: any;
  parseDurationData: any;
  parseValidityData: any;
  showUpData: any;
  showData: any;
  editPageData: any;
  params: any;
  getId: any;
  viewData: any;
  navigationSubscription;
  displayedColumns = ['sno', 'Item-Text', 'Type', 'status', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private fb: FormBuilder, private ds: DataServiceService, private ms: MainServiceService, private route: ActivatedRoute,
    private router: Router) { }

  addDuration(formInputs) {
    if (this.jsonItemForm.valid) {
      this.durationData = {
        'ID': this.getId,
        'visaDuration': formInputs.visaDuration,
        'status': formInputs.status
      }
    }
    return this.ds.postData(this.ms.url + 'cms/postVisaDuration', this.durationData).subscribe(res => {
      this.getAllVisaDurations();
      this.getId = '';
      this.jsonItemForm.controls['visaDuration'].setValue('');
      this.jsonItemForm.controls['status'].setValue('');

    });
  }

  getAllVisaDurations() {
    this.ds.getData(this.ms.url + 'cms/getvisaDuration').subscribe(res => {
      console.log(res);
      this.getdurationData = res.data;
      this.parseDurationData = new MatTableDataSource<Element>(this.getdurationData);
      this.parseDurationData.paginator = this.paginator;
      // console.log(this.getdurationData);
    });
  }

  addValidity(formInputs) {
    if (this.visaValidity.valid) {
      this.validityData = {
        'visaValidation': formInputs.visaValidation,
        'status': formInputs.status
      }

    }
    return this.ds.postData(this.ms.url + 'cms/postVisaValidty', this.validityData).subscribe(res => {
      // console.log(res);
    });
  }

  editPage(element, i) {
    this.editPageData = element;
    this.getId = element.ID;
    if (this.getId) {
      this.ds.getData(this.ms.url + 'cms/visaDurationById/?id=' + this.getId).subscribe(res => {
        // console.log(res);
        this.showData = this.jsonItemForm.controls['visaDuration'].setValue(res['data']['duration']);
        let status = (res['data']['durationStatus'] == 1 ? true : false);
        this.jsonItemForm.controls['status'].setValue(status);
        // console.log(this.showData);
      });
    }
  }

  deletePage(element, i) {
    this.editPageData = element;
    this.getId = element.ID;
    if (this.getId) {
      this.ds.getData(this.ms.url + 'cms/deleteDuration/?id=' + this.getId).subscribe(res => {
        this.getAllVisaDurations();
      });
    }
  }

  viewPage(element, i) {
    this.viewData = element;
    let ID = element.ID;
    if (ID) {
      this.ds.getData(this.ms.url + 'cms/visaDurationById/?id=' + ID).subscribe(res => {
        // console.log(res);

      })
    }

  }

  ngOnInit() {
    this.jsonItemForm = this.fb.group({
      array_index: ['', Validators.required],
      item_text: ['', Validators.required],
      status: [''],
    });
    this.visaValidity = this.fb.group({
      visaValidation: ['', Validators.required],
      status: [''],
    });
    // this.getAllVisaDurations();
    this.getAllVisaOptions();
  }

  // Add item in visa_options.json file (27-08-2018 11:46 AM)
  addJsonItem(formInputs) {
    if (this.jsonItemForm.valid) {
      this.jsonItemFormData = {
        'item_id': this.item_id,
        'array_index': formInputs.array_index,
        'item_text': formInputs.item_text,
        'status': formInputs.status,
        'action': this.formAction
      }
      return this.ds.postData(this.ms.url + 'Cms/createJsonFile', this.jsonItemFormData).subscribe(res => {
        // console.log('Post Data:', res.data)
        this.getAllVisaOptions();
        this.item_id = '';
        this.formAction = 'insert';
        this.jsonItemForm.controls['array_index'].setValue('');
        this.jsonItemForm.controls['item_text'].setValue('');
        this.jsonItemForm.controls['status'].setValue('');
      });
    }
  }
  // Edit / Update item in visa_options.json file (27-08-2018 12:01 PM)
  editJsonItem(element, i) {
    console.log('Element:', element);
    this.item_id = element.item_id;
    this.formAction = 'update';
    let array_index = (element.array_index ? element.array_index : 'visaTypes');
    // this.jsonItemForm.controls['array_index'].setValue(element.array_index);
    this.jsonItemForm.controls['item_text'].setValue(element.item_text);
    this.jsonItemForm.controls['array_index'].setValue(array_index);
    let status = (element.status == 1 ? true : false);
    this.jsonItemForm.controls['status'].setValue(status);
    window.scrollTo(0, 0)
  }
  // Edit / Update item in visa_options.json file (27-08-2018 12:01 PM)
  deleteJsonItem(element, i) {
    this.item_id = element.item_id;
    this.formAction = 'delete';    
    this.jsonItemFormData = {
      'item_id': this.item_id,
      'array_index': (element.array_index ? element.array_index : 'visaTypes'),
      'item_text': element.item_text,
      'status': element.status,
      'action': this.formAction
    }
    return this.ds.postData(this.ms.url + 'Cms/createJsonFile', this.jsonItemFormData).subscribe(res => {
      // console.log('Post Data:', res.data)
      this.getAllVisaOptions();
      this.item_id = '';
      this.formAction = 'insert';
      this.jsonItemForm.controls['array_index'].setValue('');
      this.jsonItemForm.controls['item_text'].setValue('');
      this.jsonItemForm.controls['status'].setValue('');
    });
  }
  // Get All Index in visa_options.json file (27-08-2018 12:10 PM)
  getAllVisaOptions() {
    this.ds.getVisaOptions().subscribe(res => {
      console.log(res)
      this.getdurationData = res['visaTypes'];
      // this.getdurationData = res['visaDocuments'];
      for (let i of res['visaDocuments']) {
        i.array_index = "visaDocuments";
        this.getdurationData.push(i);
      }
      for (let i of res['visaDurations']) {
        i.array_index = "visaDurations";
        this.getdurationData.push(i);
      }
      for (let i of res['visaValidities']) {
        i.array_index = "visaValidities";
        this.getdurationData.push(i);
      }
      // for (let i of res['visaTypes']) {
      //   i.array_index = "visaTypes";
      //   this.getdurationData.push(i);
      //   this.getdurationData.pop();
      // }
      for (let i of res['numOfEntries']) {
        i.array_index = "numOfEntries";
        this.getdurationData.push(i);
      }
      for (let i of res['visaIncludes']) {
        i.array_index = "visaIncludes";
        this.getdurationData.push(i);
      }
      for (let i of res['validCities']) {
        i.array_index = "validCities";
        this.getdurationData.push(i);
      }
      // console.log('DataTables Data:', this.getdurationData);
      this.parseDurationData = new MatTableDataSource<Element>(this.getdurationData);
      this.parseDurationData.paginator = this.paginator;
      // console.log(this.paginator)
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.parseDurationData.filter = filterValue;
  }
}
