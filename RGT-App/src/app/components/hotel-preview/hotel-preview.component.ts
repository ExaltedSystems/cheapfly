import { MainServiceService } from './../../services/main.service';
import { DataServiceService } from './../../services/data-service.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';


@Component({
  selector: 'app-hotel-preview',
  templateUrl: './hotel-preview.component.html',
  styleUrls: ['./hotel-preview.component.css']
})
export class HotelPreviewComponent implements OnInit {

  hotelId: number;
  params: any;
  hotelData:object = [];

  backPage = "/properties";
  backpageTitle = 'Properties List';

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  hotelImages:any = [];
  
  constructor(private route: ActivatedRoute, private dataService: DataServiceService, 
    private mainService: MainServiceService,) { }

  ngOnInit() {
    this.params = this.route.params.subscribe(params => {
      console.log('param : '+(params['id']));
      this.hotelId = params['id']; // (+) converts string 'id' to a number

      console.log(this.hotelId)

      // In a real app: dispatch action to load the details here.
   });

   
    this.dataService.getData(this.mainService.url+'HotelLists/hotelPreview/'+this.hotelId)
    .subscribe(res => {
      console.log(res);
      this.hotelData = res;
    });

    this.dataService.getData(this.mainService.url+'HotelLists/images/'+this.hotelId)
      .subscribe(res => {
        let imgObj = JSON.stringify(res).replace(/\\/g, "");
        this.galleryImages = JSON.parse(imgObj);
    });

    this.galleryOptions = [
      {
          width: '600px',
          height: '400px',
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
          breakpoint: 800,
          width: '100%',
          height: '600px',
          imagePercent: 80,
          thumbnailsPercent: 20,
          thumbnailsMargin: 20,
          thumbnailMargin: 20
      },
      // max-width 400
      {
          breakpoint: 400,
          preview: false
      }
    ];
        
    // this.galleryImages = this.hotelImages;

    //   this.galleryImages =  [
    //     {
    //       small:"http://192.168.5.75/localhotel/uploads/thumbnails/user.jpg",
    //       medium:"http://192.168.5.75/localhotel/uploads/user.jpg",
    //       big:"http://192.168.5.75/localhotel/uploads/user.jpg"
    //     },
    //     {
    //       small:"http://192.168.5.75/localhotel/uploads/thumbnails/nasir.jpg",
    //       medium:"http://192.168.5.75/localhotel/uploads/nasir.jpg",
    //       big:"http://192.168.5.75/localhotel/uploads/nasir.jpg"
    //     }
    // ];
    
  } // onInit


}
