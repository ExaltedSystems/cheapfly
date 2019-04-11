import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'app/services/data-service.service';
import { MainServiceService } from 'app/services/main.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-scroller',
  templateUrl: './view-scroller.component.html',
  styleUrls: ['./view-scroller.component.css']
})
export class ViewScrollerComponent implements OnInit {

  params:any;
  scrollerViewId:any;
  scrollerData:object;
  constructor(private ds:DataServiceService, private ms:MainServiceService,private router:Router,private route:ActivatedRoute) { }

  ngOnInit() {
    this.params = this.route.params.subscribe(params => {
      this.scrollerViewId = params['id']; // (+) converts string 'id' to a number
      console.log('viewId',this.scrollerViewId);
      this.ds.getData(this.ms.url+'Cms/scrollerById/'+this.scrollerViewId).subscribe(res=>{
        this.scrollerData=res.data;
        console.log(this.scrollerData);
      });
  });

}

}
