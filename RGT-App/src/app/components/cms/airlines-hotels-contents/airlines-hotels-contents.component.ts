import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { MainServiceService } from './../../../services/main.service';
import { DataServiceService } from '../../../services/data-service.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Element } from '@angular/compiler';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators/catchError';
import { Navigation } from 'selenium-webdriver';

@Component({
  selector: 'app-airlines-hotels-contents',
  templateUrl: './airlines-hotels-contents.component.html',
  styleUrls: ['./airlines-hotels-contents.component.css']
})
export class AirlinesHotelsContentsComponent implements OnInit {
  displayedColumns = ['sNo', 'title', 'urlLink', 'contentType', 'sortOrder', 'status', 'actions'];
  pageContents: any;
  parsePageContents: any;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __ds: DataServiceService, private __ms: MainServiceService, private __router: Router) { }

  ngOnInit() {
    this.__ds.getData(this.__ms.url + 'cms/allAirlinesHotels').subscribe(res => {
      console.log("Result:", res)
      this.pageContents = res['items'];
      this.parsePageContents = new MatTableDataSource<Element>(this.pageContents);
      this.parsePageContents.paginator = this.paginator;
      this.resultsLength = res['total_count'];
      this.isLoadingResults = false;
    });
  }
  editPageContent(element, i) {
    this.__router.navigate(['/addEditAirlineHotelContent'], { queryParams: { id: element.ID } });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.parsePageContents.filter = filterValue;
  }
}
