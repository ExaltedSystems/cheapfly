import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators/switchMap';
import { merge } from 'rxjs/observable/merge';
import { MainServiceService } from 'app/services/main.service';
import { DataServiceService } from 'app/services/data-service.service';
import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ViewChild } from '@angular/core';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators';
import {of as observableOf} from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { Element } from '@angular/compiler';
import { NavigationExtras } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-view-all-scroller',
  templateUrl: './view-all-scroller.component.html',
  styleUrls: ['./view-all-scroller.component.css']
})
export class ViewAllScrollerComponent implements OnInit {

  displayedColumns = ['S#', 'name', 'details', 'status','createdDate', 'actions'];
  dataSource = new MatTableDataSource();
  editPageData:any;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(private ds:DataServiceService,private ms:MainServiceService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.ds!.scrollerListings(
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
      ).subscribe(data => {
        this.dataSource.data = data
        this.dataSource.paginator=this.paginator;
      });
      console.log(this.dataSource);

     
  }

  applyFilter(filterValue: string) {
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      this.dataSource.filter = filterValue;
  }

  editPage(element,i){
      this.editPageData = element;
      let ID = element.ID;
      let extrPrams :NavigationExtras = {
        queryParams:{
          id : ID
        }
      };
      this.router.navigate(['/newScroller'],{queryParams:{id:element.ID}});
  }
}
