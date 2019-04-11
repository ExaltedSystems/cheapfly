import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
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
import { CKEditorModule } from 'ngx-ckeditor';
import * as visa_options from '../../../../assets/visa_options.json';
@Component({
  selector: 'app-umrah',
  templateUrl: './umrah.component.html',
  styleUrls: ['./umrah.component.css']
})
export class UmrahComponent implements OnInit {
  public editorValue: string = '';
  newSector: FormGroup;
  formData: Object;
  sectorsVehiclesList: any;
  parseSectorsVehiclesList: any;
  editSectorVehicles: any;
  getId: any;
  showData: any;
  umrahPackagesList :any;
  parseumrahPackagesList :any;
  displayedColumns = ['S.No', 'type', 'TypeText', 'status', 'actions'];
  displayUmrahListings = ['S.No','clientName','clientEmail','totalPackageCost', 'clientPhone', 'adults', 'children','infant','actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __fb: FormBuilder, private __ms: MainServiceService, private __ds: DataServiceService, 
    private __actRoute: ActivatedRoute, private __router: Router) { }

  ngOnInit() {
    this.getUmrahLists();
    this.getSectorVehicleLists();
    this.newSector = this.__fb.group({
      type: ['', Validators.required],
      typeText: ['', Validators.required],
      status: [''],
    });
  }

  addNewSector(formInputs) {
    if (this.newSector.valid) {
      this.formData = {
        'ID': this.getId,
        'type': formInputs.type,
        'typeText': formInputs.typeText,
        'status': formInputs.status
      }
      return this.__ds.postData(this.__ms.url + 'cms/addEditUbcSectorVehicle', this.formData).subscribe(res => {
        this.getSectorVehicleLists();
        this.resetVehicleSectorForm();
      });
    }
  }
  resetVehicleSectorForm() {
    this.getId = '';
    this.newSector.controls['type'].setValue('');
    this.newSector.controls['typeText'].setValue('');
    this.newSector.controls['status'].setValue('');
  }
  getSectorVehicleLists() {
    this.__ds.getData(this.__ms.url + 'cms/sectorVehicleList').subscribe(res => {
      this.sectorsVehiclesList = res.data;
      this.parseSectorsVehiclesList = new MatTableDataSource<Element>(this.sectorsVehiclesList);
      this.parseSectorsVehiclesList.paginator = this.paginator;
    });
  }

  getUmrahLists() {
    this.__ds.getData(this.__ms.url + 'cms/allUmrahPackagesList').subscribe(res => {
      this.umrahPackagesList = res.data;
      console.log(res);
      this.parseumrahPackagesList = new MatTableDataSource<Element>(this.umrahPackagesList);
      this.parseumrahPackagesList.paginator = this.paginator;
    });
  }
  editSectorVehicle(element, i) {
    window.scrollTo(0, 0);
    this.editSectorVehicles = element;
    this.getId = element.ID;
    if (this.getId) {
      let type;
      if (element.type == "Sector") {
        type = 2;
      } else {
        type = 1;
      }
      this.showData = this.newSector.controls['type'].setValue(type);
      this.newSector.controls['typeText'].setValue(this.editSectorVehicles.typeText);
      let status = (this.editSectorVehicles.status == 1 ? true : false);
      this.newSector.controls['status'].setValue(status);
    }
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.parseSectorsVehiclesList.filter = filterValue;
  }

  editPackage(element, i){
    let id=element.ID;

    this.__router.navigate(['/design-ubc-pkg'],{queryParams :{id :element.ID}});


  }

}
