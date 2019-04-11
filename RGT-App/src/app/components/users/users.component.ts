import { Component, OnInit, ViewChild } from '@angular/core';
import { MainServiceService } from './../../services/main.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataServiceService } from '../../services/data-service.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Element } from '@angular/compiler';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users:object = []; 
  displayedColumns = ['sNo', 'username', 'email', 'activated', 'actions'];
  pageContents: any;
  parseUsers: any;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __actRoute: ActivatedRoute, private __ds: DataServiceService, private __ms: MainServiceService, private __router: Router) { }

  ngOnInit() {
    /**
     * Get All Users List
     */
    this.__ds.getData(this.__ms.url+'auth/userList').subscribe(res => {
      this.users = res.data
      this.pageContents = res['data'];
      this.parseUsers = new MatTableDataSource<Element>(this.pageContents);
      this.parseUsers.paginator = this.paginator;
      this.resultsLength = res['total_count'];
      this.isLoadingResults = false;
    })
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.parseUsers.filter = filterValue;
  }
  editUser(element, i) {
    // console.log('Edit:', element);
    this.__router.navigate(['/addEditUser'], { queryParams: { id: element.id } });
  }

}
