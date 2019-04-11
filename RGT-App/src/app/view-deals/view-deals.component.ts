import { Route } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { DataServiceService } from 'app/services/data-service.service';
import { MainServiceService } from 'app/services/main.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-view-deals',
  templateUrl: './view-deals.component.html',
  styleUrls: ['./view-deals.component.css']
})
export class ViewDealsComponent implements OnInit {
  params:any;
  dealsViewId:any;
  dealData:object;
  constructor(private ds:DataServiceService, private ms:MainServiceService,private router:Router,private route:ActivatedRoute) { }

  ngOnInit() {
    this.params = this.route.params.subscribe(params => {
      this.dealsViewId = params['id']; // (+) converts string 'id' to a number
      // console.log('viewId',this.dealsViewId);
      this.ds.getData(this.ms.url+'Cms/dealById/'+this.dealsViewId).subscribe(res=>{
        this.dealData=res.data;
        console.log(this.dealData);
      });
  });

}
}