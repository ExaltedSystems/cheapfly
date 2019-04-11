import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';
import { DataServiceService } from '../../../services/data-service.service';
import { MainServiceService } from '../../../services/main.service';
import { User } from '../../../models/index';
import * as jwt_decode from 'jwt-decode';
import { ActivatedRoute, Router } from '@angular/router/';
import { CKEditorModule } from 'ngx-ckeditor';
import { FileHolder } from 'angular2-image-upload/lib/image-upload/image-upload.component';
import { ToasterService } from 'angular2-toaster/src/toaster.service';

@Component({
  selector: 'app-new-airline-hotel-contents',
  templateUrl: './new-airline-hotel-contents.component.html',
  styleUrls: ['./new-airline-hotel-contents.component.css']
})
export class NewAirlineHotelContentsComponent implements OnInit {

  pageUrl: string;
  newPage: FormGroup;
  currentUser: User;
  param: any;
  btnSubmitError: string = '';
  successErrorMsg: string = '';
  newPageData: object;
  editPageId: any = '';
  pageData: any = '';
  thumbnailOptions: FancyImageUploaderOptions;

  constructor(private __fb: FormBuilder, private __ds: DataServiceService, private __ms: MainServiceService,
    private __actRoute: ActivatedRoute, private __toastServ: ToasterService, private __router:Router) {
    this.currentUser = jwt_decode(localStorage.getItem('currentUser')).id;
  }

  ngOnInit() {
    this.newPage = this.__fb.group({
      title: ['', Validators.required],
      airlineCode: [''],
      urlLink: ['', Validators.required],
      sortOrder: ['', Validators.required],
      contentType: ['', Validators.required],
      metaTitle: ['', Validators.required],
      metaKeywords: [''],
      status: ['', Validators.required],
      metaDescription: ['', Validators.required],
      shortDetails: ['', Validators.required],
      details: ['', Validators.required],
    });
    this.param = this.__actRoute.params.subscribe(urlId => {
      this.editPageId = this.__actRoute.snapshot.queryParams.id;
    });
    if (this.editPageId) {
      this.__ds.getData(this.__ms.url + 'cms/viewAirlineHotelContents/?id=' + this.editPageId).subscribe(res => {
        // console.log(res);
        // this.pageData =
        this.newPage.controls['title'].setValue(res['data']['title']);
        this.newPage.controls['airlineCode'].setValue(res['data']['airlineCode']);
        this.newPage.controls['urlLink'].setValue(res['data']['urlLink']);
        this.newPage.controls['sortOrder'].setValue(res['data']['sortOrder']);
        this.newPage.controls['contentType'].setValue(res['data']['contentType']);
        this.newPage.controls['metaTitle'].setValue(res['data']['metaTitle']);
        this.newPage.controls['metaKeywords'].setValue(res['data']['metaKeywords']);
        this.newPage.controls['status'].setValue(res['data']['status']);
        this.newPage.controls['metaDescription'].setValue(res['data']['metaDescription']);
        this.newPage.controls['shortDetails'].setValue(res['data']['shortDetails']);
        this.newPage.controls['details'].setValue(res['data']['details']);
      });
    }
    this.thumbnailOptions = {
      thumbnailWidth: 1024,
      thumbnailHeight: 228,
      uploadUrl: this.__ms.uploadUrl + "Cms/uploadAirlineHotelBannerImg/" + this.editPageId,
    };
  }
  addNewPage(formData) {
    if (this.newPage.valid) {
      this.newPageData = {
        'ID': this.editPageId,
        'title': formData.title,
        'airlineCode': formData.airlineCode,
        'urlLink': formData.urlLink,
        'sortOrder': formData.sortOrder,
        'contentType': formData.contentType,
        'metaTitle': formData.metaTitle,
        'metaKeywords': formData.metaKeywords,
        'status': formData.status,
        'metaDescription': formData.metaDescription,
        'shortDetails': formData.shortDetails,
        'details': formData.details,
        'userId': this.currentUser,
      }
      return this.__ds.postData(this.__ms.url + 'Cms/addEditAirlineHotelContent', this.newPageData)
        .subscribe(res => {
          this.__toastServ.pop('success', 'Insert / Update', res.message);
          this.__router.navigate(['/addEditAirlineHotelContent'], { queryParams: { id: res.data['ID'] } });
        });
    } else {
      this.__toastServ.pop('error', 'Error Info', `Please fill-out all the required fields`);
      this.newPage.controls['title'].markAsTouched();
      this.newPage.controls['airlineCode'].markAsTouched();
      this.newPage.controls['urlLink'].markAsTouched();
      this.newPage.controls['sortOrder'].markAsTouched();
      this.newPage.controls['contentType'].markAsTouched();
      this.newPage.controls['metaTitle'].markAsTouched();
      this.newPage.controls['metaKeywords'].markAsTouched();
      this.newPage.controls['status'].markAsTouched();
      this.newPage.controls['metaDescription'].markAsTouched();
      this.newPage.controls['shortDetails'].markAsTouched();
      this.newPage.controls['details'].markAsTouched();
    }
  }
  // Upload Visa Thumbnail Image
  onUpload(file: UploadedFile) {
      console.log(file.response);
  }
}
