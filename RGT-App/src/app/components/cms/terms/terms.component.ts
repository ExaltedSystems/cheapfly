import { Component, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationExtras, Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { CKEditorModule } from 'ngx-ckeditor';
@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
