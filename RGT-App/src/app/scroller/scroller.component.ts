import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'app/services/data-service.service';
import { MainServiceService } from 'app/services/main.service';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms/src/model';
import { Observable } from 'rxjs/Observable';
import { Route, ActivatedRoute } from '@angular/router';
import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { Router } from '@angular/router';
import * as  jwt_decode from 'jwt-decode';
import { User } from 'app/models';
import { MatDatepickerModule, } from '@angular/material/datepicker';

@Component({
  selector: 'app-scroller',
  templateUrl: './scroller.component.html',
  styleUrls: ['./scroller.component.css']
})
export class ScrollerComponent implements OnInit {

  succErrCls: any;
  succErrMsg: any;
  currentUser: User;
  scrollerForm: any;
  scrollerData: any;
  params: any;
  __isScroller: any = 1;
  scData: any;
  newscrolerLastId: any;
  scrollerupdateId: any;
  thumbnailOptions: FancyImageUploaderOptions;
  thumbnailImage: any;
  imageAlt: string;
  display: boolean = false;
  public editorValue: string = '';
  isImagePopup: boolean = false;

  constructor(private fb: FormBuilder, private ds: DataServiceService, private ms: MainServiceService, private route: ActivatedRoute, private router: Router) {
    this.currentUser = jwt_decode(localStorage.getItem('currentUser')).id;
  }

  ngOnInit() {
    this.thumbnailOptions = {
      thumbnailHeight: 322,
      thumbnailWidth: 322,
      uploadUrl: this.ms.uploadUrl + "Cms/uploadScrolleaImg/" + this.scrollerupdateId,
    };
    this.scrollerForm = this.fb.group({
      name: ['', Validators.required],
      metaTitle: ['', Validators.required],
      metaKeywords: ['', Validators.required],
      metaDescription: ['', Validators.required],
      description: ['', Validators.required],
      status: [''],
      sort: ['', Validators.required],
      url: ['', Validators.required],
      activationDate: ['', Validators.required],
      deActivationDate: ['', Validators.required],
      image_alt: ['', Validators.required],
      Image_title: ['', Validators.required],

    });
    console.log(this.__isScroller);


    this.params = this.route.params.subscribe(params => {
      this.scrollerupdateId = this.route.snapshot.queryParams.id; // (+) converts string 'id' to a number
      if (this.scrollerupdateId) {

        this.thumbnailOptions = {
          thumbnailHeight: 322,
          thumbnailWidth: 322,
          uploadUrl: this.ms.uploadUrl + "Cms/uploadScrolleaImg/" + this.scrollerupdateId,//'http://192.168.5.75:4200/uploads/visas/thumbnails',
          allowedImageTypes: ['image/png', 'image/jpeg', 'image/jpg'],
          // maxImageSize: 3
        };
        this.ds.getData(this.ms.url + 'Cms/scrollerById/?id=' + this.scrollerupdateId).subscribe(res => {
          if (res) {
            console.log('data:', res.data)
            // this.thumbnailImage = "http://192.168.5.75/rgtapp/sliderImages/"+res.data['image'];
            this.thumbnailImage = res.data['image'];
            this.imageAlt = res.data['imageAlt'];
            this.scrollerForm.controls['name'].setValue(res['data']['name']);
            this.scrollerForm.controls['metaTitle'].setValue(res['data']['metaTitle']);
            this.scrollerForm.controls['metaKeywords'].setValue(res['data']['metaKeywords']);
            this.scrollerForm.controls['metaDescription'].setValue(res['data']['metaDescription']);
            this.scrollerForm.controls['image_alt'].setValue(res['data']['imageAlt']);
            this.scrollerForm.controls['Image_title'].setValue(res['data']['imageTitle']);
            this.scrollerForm.controls['description'].setValue(res['data']['description']);
            let status = (res['data']['status'] == 1 ? true : false);
            this.scrollerForm.controls['status'].setValue(status);
            this.scrollerForm.controls['sort'].setValue(res['data']['sort']);
            this.scrollerForm.controls['url'].setValue(res['data']['URL']);
            let activationDate = res['data']['activationDate'];
            let deActivationDate = res['data']['deActivationDate'];
            this.scrollerForm.controls['activationDate'].setValue(new Date(activationDate));
            this.scrollerForm.controls['deActivationDate'].setValue(new Date(deActivationDate));
          }
        });
      }
    });
  }

  addScroller(forminputs) {
    if (this.scrollerForm.valid) {
      console.log('acti', forminputs.activationDate);
      let activationDate = this.ds.setDateFormat(forminputs.activationDate);
      let deActivationDate = this.ds.setDateFormat(forminputs.deActivationDate);
      this.scrollerData = {

        'ID': this.scrollerupdateId,
        'name': forminputs.name,
        'metaTitle': forminputs.metaTitle,
        'metaKeywords': forminputs.metaKeywords,
        'metaDescription': forminputs.metaDescription,
        'description': forminputs.description,
        'status': forminputs.status,
        'createdBy': this.currentUser,
        'sort': forminputs.sort,
        'activationDate': activationDate,
        'url': forminputs.url,
        'deActivationDate': deActivationDate,
        'imageAlt': forminputs.image_alt,
        'imageTitle': forminputs.Image_title,
        'scroller': this.__isScroller,

      }

      console.log('scrollerData', this.scrollerData);
      return this.ds.postData(this.ms.url + 'Cms/newDeals', this.scrollerData).subscribe(res => {
        console.log('response', res.data);
        // this.scData = res.data;
        this.newscrolerLastId = res['last_id'];
        this.succErrMsg = res.message;
        this.succErrCls = res['className'];
        console.log(this.succErrCls);
        console.log(this.succErrMsg);
        this.isImagePopup = true;
        this.showDialog();


        // for (var key in res.data) {
        //     let jsonVisaTypeId:number = res.data[key]['visaTypeId'];                    
        //     this.jsonVisaTypeName.push(this.visaTypeLists.find(result => result.item_id == jsonVisaTypeId).visaType);
        // }
        if (this.scData) {
          // Get Last Id and Update visaThumbnail field (Insert Image)
          this.thumbnailOptions = {
            thumbnailHeight: 150,
            thumbnailWidth: 150,
            uploadUrl: this.ms.uploadUrl + "Cms/uploadScrolleaImg/" + res['last_id'],//'http://192.168.5.75:4200/uploads/visas/thumbnails',
            allowedImageTypes: ['image/png', 'image/jpeg', 'image/jpg'],
            // maxImageSize: 3
          };
          console.log(this.thumbnailOptions);
        }
      });
    }

  }
  showDialog() {
    this.display = true;
  }
  onUpload(file: UploadedFile) {
    // this.mainService.uploadUrl+"Cms/uploadPic"
    console.log(file);
    this.router.navigate['/scroller'];
  }

}
