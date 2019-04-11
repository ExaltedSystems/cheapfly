import { Router } from '@angular/router';
import { MainServiceService } from './../../../services/main.service';
import { DataServiceService } from '../../../services/data-service.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Element } from '@angular/compiler';
import { merge } from 'rxjs/observable/merge';
import {of as observableOf} from 'rxjs/observable/of';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators/catchError';
import { NavigationExtras } from '@angular/router/src/router';

@Component({
  selector: 'app-visa',
  templateUrl: './visa.component.html',
  styleUrls: ['./visa.component.css']
})
export class VisaComponent implements OnInit {
  displayedColumns = ['SNo', 'countryName', 'details', 'status','createdDate', 'actions'];
  propertiesListing;
  dataSource = new MatTableDataSource();

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  editPageData:object;
  pageEditData;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dataService: DataServiceService, private mainService: MainServiceService, private router: Router) { }

  ngOnInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.dataService!.visasListing(
            this.sort.active, this.sort.direction, this.paginator.pageIndex);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;

          return data.items;
        }),
        catchError((err) => {
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  editPage(element, i){
    this.editPageData = element;
    // console.log(this.editPageData);
    let ID = element.ID;
    let extraParams: NavigationExtras = {
      queryParams: {
        id : ID
      }
    };
    // this.router.navigate(['/newVisa'], extraParams);
    this.router.navigate(['/newVisa'], {queryParams: {id : element.ID}});
    
  }

}
