import { ToasterService } from 'angular2-toaster';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatPaginator, MatSort, MatTableDataSource, MatMenuModule } from '@angular/material';
import { Route, ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DataServiceService } from 'app/services/data-service.service';
import { MainServiceService } from 'app/services/main.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-hotels-list',
  templateUrl: './hotels-list.component.html',
  styleUrls: ['./hotels-list.component.css']
})
export class HotelsListComponent implements OnInit {
  hotelColumns = ['select', 'SNo', 'City', 'hotelName', 'hotelType', 'markUp', 'hotelVendor', 'status', 'actions'];
  hotelLists: any;
  markupForm: any;
  selectedData: any;
  parseHotelLists: any;
  formData: any;
  hotelResultsLength = 0;
  isLoadingResults = true;
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __ms: MainServiceService, private __ds: DataServiceService, private __fb: FormBuilder,
    private __actRoute: ActivatedRoute, private __router: Router, private __toaster:ToasterService) { }

  ngOnInit() {
    this.markupForm = this.__fb.group({
      markup: ['', Validators.required],

    });
    this.__ds.getData(this.__ms.url + 'cms/allUmrahHotelsList').subscribe(res => {
      this.hotelLists = res['items'];
      this.parseHotelLists = new MatTableDataSource<Element>(this.hotelLists);
      this.parseHotelLists.paginator = this.paginator;
      this.hotelResultsLength = res['total_count'];
      this.isLoadingResults = false;
    });
  }



  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    console.log(event);
    //if(event.target.checked){
    //this.selectedData = this.selection.selected;
    //}else{
      //this.selectedData='';
    //}
    const numSelected = this.selection.selected.length;
    const numRows = this.parseHotelLists.data.length;
    // console.log(selectedData);
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.parseHotelLists.data.forEach(row => this.selection.select(row));
      
  }

  updateMarkup(forminputs) {
    if (this.markupForm.valid) {
      this.formData = {
        'markup': forminputs.markup,
        'hotelLists': this.selectedData,
      }
      return this.__ds.postData(this.__ms.url + 'cms/updateUmrahHotelsMarkup', this.formData).subscribe(res => {
        this.__toaster.pop('success',res.message);
      });
    }else{
      this.__toaster.pop('error','Error, while updating hotel markup and rates')
    }
    console.log(this.selectedData);
  }
  createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

}
