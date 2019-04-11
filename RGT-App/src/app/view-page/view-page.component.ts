import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'app/services/data-service.service';
import { MainServiceService } from 'app/services/main.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.css']
})
export class ViewPageComponent implements OnInit {
  params: any;
  pageLevel: any;
  pageViewId;
  pageData: object = {
    'name': '',
    'parentName':'',
    'metaTitle':'',
    'metaKeywords':'',
    'metaDescription':'',
    'URL':'',
    'shortDescription':'',
    'description':'',
    'status':0,
  };
  constructor(private ds: DataServiceService, private ms: MainServiceService, private router: Router, private route: ActivatedRoute, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.params = this.route.params.subscribe(params => {
      this.pageViewId = this.route.snapshot.queryParams.id;
      this.ds.getData(this.ms.url + 'Cms/allPages/?id=' + this.pageViewId).subscribe(res => {
        this.pageData = res.data;
        console.log("pageData", this.pageData);
      });
    });
  }

}
