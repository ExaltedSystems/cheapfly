import { Component, OnInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { DataServiceService } from 'app/services/data-service.service';
import { MainServiceService } from 'app/services/main.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { User } from 'app/models';
import * as jwt_decode from 'jwt-decode';
import { AlertService } from 'app/services';

@Component({
  selector: 'app-navbar-contents',
  templateUrl: './navbar-contents.component.html',
  styleUrls: ['./navbar-contents.component.css']
})
export class NavbarContentsComponent implements OnInit {
  allNavbarMenus: object;
  allParentMenus: object;
  navbarContentForm: FormGroup;
  navbarContentFormData: object;
  parseNavbarData: any;
  // Current Logged User
  currentUser: User;
  // ID for Edit / Update Navbar
  editNavbarId: any;
  // Success / Error Message
  succErrMsg: string;
  succErrCls: string;
  // Table Columns
  displayedColumns = ['SNo', 'Title', 'Parent', 'Url-Link', 'Sort', 'Show-in-topmenu', 'Show-in-footer', 'Status', 'Actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __fb: FormBuilder, private __ds: DataServiceService, private __ms: MainServiceService,
    private __actRoute: ActivatedRoute, private __router: Router, private __alertServ: AlertService) {
    // Get Current Login UserId
    this.currentUser = jwt_decode(localStorage.getItem('currentUser')).id;
  }

  ngOnInit() {
    this.getAllNavbarContents();
    this.getAllParentNavbar();
    this.navbarContentForm = this.__fb.group({
      navbarTitle: ['', Validators.required],
      parentId: ['', Validators.required],
      // urlLink: ['', Validators.required],
      urlLink: [''],
      sortOrder: ['', Validators.required],
      showInTopmenu: [''],
      showInFooter: [''],
      status: [''],
    });
  }
  // Get All Navbar Contents (30-08-2018 05:59 PM)
  getAllNavbarContents() {
    this.__ds.getData(this.__ms.url + 'Cms/allNavbarContents').subscribe(res => {
      // console.log('Navbar Content:', res);
      this.parseNavbarData = res.data;
      this.parseNavbarData = new MatTableDataSource<Element>(this.parseNavbarData);
      this.parseNavbarData.paginator = this.paginator;
    });
  }
  // Get AllNavbar Parent ID (30-08-2018 06:09 PM)
  getAllParentNavbar() {
    this.__ds.getData(this.__ms.url + 'Cms/allParentNavbar').subscribe(res => {
      // console.log('Navbar Content:', res);
      this.allParentMenus = res.data;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.parseNavbarData.filter = filterValue;
  }
  // Insert / Update Navbar Contents (31-08-2018 10:18 AM)
  addEditNavbarContent(formData) {
    // console.log('Form Data:', formData);
    // return false;
    if (this.navbarContentForm.valid) {
      this.navbarContentFormData = {
        'ID': this.editNavbarId,
        'navbarTitle': formData.navbarTitle,
        'parentId': formData.parentId,
        'urlLink': formData.urlLink,
        'showInTopmenu': formData.showInTopmenu,
        'showInFooter': formData.showInFooter,
        'sortOrder': formData.sortOrder,
        'status': formData.status,
        'userId': this.currentUser
      }
      // console.log('FormData:', this.navbarContentFormData)
      return this.__ds.postData(this.__ms.url + 'Cms/addEditNavbarContent', this.navbarContentFormData)
        .subscribe(res => {
          // Show Success / Error Message
          // this.succErrMsg = res.message;
          // this.succErrCls = res['className'];
          this.__alertServ.success(res.message);
          // Call to refresh datatables data
          this.getAllNavbarContents();
          this.getAllParentNavbar();
          // Reset Navbar Form Fields
          this.editNavbarId = '';
          this.navbarContentForm.controls['navbarTitle'].setValue('');
          this.navbarContentForm.controls['parentId'].setValue('');
          this.navbarContentForm.controls['urlLink'].setValue('');
          this.navbarContentForm.controls['showInTopmenu'].setValue('');
          this.navbarContentForm.controls['showInFooter'].setValue('');
          this.navbarContentForm.controls['sortOrder'].setValue('');
          this.navbarContentForm.controls['status'].setValue('');
          setTimeout(() => { this.__alertServ.clear(); }, 5000);
        });
    } else {
      this.__alertServ.error('Please fill all the required fields .....!')
      setTimeout(() => { this.__alertServ.clear(); }, 5000);
    }
  }
  resetNavbarContentForm() {
    // Reset Navbar Form Fields
    this.editNavbarId = '';
    this.navbarContentForm.controls['navbarTitle'].setValue('');
    this.navbarContentForm.controls['parentId'].setValue('');
    this.navbarContentForm.controls['urlLink'].setValue('');
    this.navbarContentForm.controls['showInTopmenu'].setValue(false);
    this.navbarContentForm.controls['showInFooter'].setValue(false);
    this.navbarContentForm.controls['sortOrder'].setValue('');
    this.navbarContentForm.controls['status'].setValue(false);
  }
  // Update Navbar Contents (31-08-2018 10:42 AM)
  editNavbarItem(element, i) {
    window.scrollTo(0, 0);
    this.succErrCls = '';
    // console.log('Edit Data:', element)
    let showInTopmenu = element.showInTopmenu == 0 ? false : true;
    let showInFooter = element.showInFooter == 0 ? false : true;
    let status = element.status == 0 ? false : true;
    // Set Visa Details Fields for Inserting Another Record
    this.editNavbarId = element.ID;
    this.navbarContentForm.controls['navbarTitle'].setValue(element.navbarTitle);
    this.navbarContentForm.controls['parentId'].setValue(element.parentId);
    this.navbarContentForm.controls['urlLink'].setValue(element.urlLink);
    this.navbarContentForm.controls['showInTopmenu'].setValue(showInTopmenu);
    this.navbarContentForm.controls['showInFooter'].setValue(showInFooter);
    this.navbarContentForm.controls['sortOrder'].setValue(element.sortOrder);
    this.navbarContentForm.controls['status'].setValue(status);
  }

}
