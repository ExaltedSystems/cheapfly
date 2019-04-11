import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectModule, MatPaginator, MatSort, MatTableDataSource, MatTableModule } from '@angular/material';
import { DataServiceService } from 'app/services/data-service.service';
import { MainServiceService } from 'app/services/main.service';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router, NavigationEnd } from '@angular/router';
import * as visa_options from '../../../../assets/visa_options.json';
import { AlertService } from 'app/services';
import { ToasterService } from 'angular2-toaster/src/toaster.service';

@Component({
  selector: 'app-transport-list',
  templateUrl: './transport-list.component.html',
  styleUrls: ['./transport-list.component.css']
})
export class TransportListComponent implements OnInit {
  newTransport: FormGroup;
  TransportformData: object;
  allSectors: any;
  allVehicles: any;
  visaCurrenciesList: any;
  transportLists: any;
  parseTransportLists: any;
  editTransport: any;
  typeId: any;
  transportColumns = ['S.No', 'sector', 'vehicle', 'currency', 'price', 'markup', 'markupPrice', 'status', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __fb: FormBuilder, private __ms: MainServiceService, private __ds: DataServiceService,
    private __actRoute: ActivatedRoute, private __router: Router, private __toastServ: ToasterService) { }

  ngOnInit() {
    this.getTransportLists();
    this.__ds.getVisaOptions().subscribe(res => {
      this.visaCurrenciesList = res['worldCurrencies'];
    });
    this.__ds.getData(this.__ms.url + 'cms/sectorLists').subscribe(res => {
      this.allSectors = res.data;
    });
    this.__ds.getData(this.__ms.url + 'cms/vehicleLists').subscribe(res => {
      this.allVehicles = res.data;
    });
    this.newTransport = this.__fb.group({
      sectorId: ['', Validators.required],
      vehicleId: ['', Validators.required],
      price: ['', Validators.required],
      markupPrice: ['', Validators.required],
      markupPercent: ['', Validators.required],
      currencyId: ['', Validators.required],
      status: [''],
    });
    this.newTransport.controls['currencyId'].setValue('SAR');
  }
  getTransportLists() {
    this.__ds.getData(this.__ms.url + 'cms/transportLists').subscribe(res => {
      this.transportLists = res.data;
      this.parseTransportLists = new MatTableDataSource<Element>(this.transportLists);
      this.parseTransportLists.paginator = this.paginator;
    });
  }
  editTransportLists(element, i) {
    window.scrollTo(0, 0);
    this.editTransport = element;
    this.typeId = element.transportId;
    if (this.typeId) {
      this.newTransport.controls['sectorId'].setValue(this.editTransport.sectorId);
      this.newTransport.controls['vehicleId'].setValue(this.editTransport.vehicleId);
      this.newTransport.controls['price'].setValue(this.editTransport.price);
      this.newTransport.controls['markupPrice'].setValue(this.editTransport.markupPrice);
      this.newTransport.controls['markupPercent'].setValue(this.editTransport.markupPercent);
      this.newTransport.controls['currencyId'].setValue(this.editTransport.currencyId);
      let status = (this.editTransport.transportStatus == 1 ? true : false);
      this.newTransport.controls['status'].setValue(status);
      // this.__alertServ.success('Data to be update.....');
      this.__toastServ.pop('info', 'Update Record', `Update this record`);
    }
  }
  addNewTransport(formInputs) {
    if (this.newTransport.valid) {
      this.TransportformData = {
        'ID': this.typeId,
        'sectorId': formInputs.sectorId,
        'vehicleId': formInputs.vehicleId,
        'price': formInputs.price,
        'markupPrice': formInputs.markupPrice,
        'markupPercent': formInputs.markupPercent,
        'currencyId': formInputs.currencyId,
        'status': formInputs.status
      }
      return this.__ds.postData(this.__ms.url + 'cms/addNewTransport', this.TransportformData).subscribe(res => {
        this.getTransportLists();
        this.resetTransportForm();
        this.__toastServ.pop('success', 'Success', res.message);
      });
    } else {
      this.__toastServ.pop('error', 'Error ..!', `Please fillout all required fields.....`);
    }
  }

  createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  calMarkupPrice() {
    let price = +this.newTransport.controls['price'].value;
    let mkupPercent = +this.newTransport.controls['markupPercent'].value;
    let mkupPrice = price + (price * mkupPercent / 100);
    this.newTransport.controls['markupPrice'].setValue(mkupPrice);
  }
  resetTransportForm() {
    this.typeId = '';
    this.newTransport.controls['sectorId'].setValue('');
    this.newTransport.controls['vehicleId'].setValue('');
    this.newTransport.controls['price'].setValue('');
    this.newTransport.controls['markupPrice'].setValue('');
    this.newTransport.controls['markupPercent'].setValue('');
    this.newTransport.controls['currencyId'].setValue('SAR');
    this.newTransport.controls['status'].setValue(false);
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.parseTransportLists.filter = filterValue;
  }

}
