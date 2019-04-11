import { Component, OnInit } from '@angular/core';
import { DataServiceService } from './../../../services/data-service.service';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms/src/model';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';
import { MatSelectModule } from '@angular/material/select';
import { MainServiceService } from 'app/services/main.service';
import { HttpClient } from '@angular/common/http';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import * as  jwt_decode from 'jwt-decode';
import { User } from 'app/models';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ToasterService } from 'angular2-toaster/src/toaster.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-new-deal',
  templateUrl: './new-deal.component.html',
  styleUrls: ['./new-deal.component.css']
})
export class NewDealComponent implements OnInit {
  currentUser: User;
  dealsForm: any;
  dealData: any;
  params: any;
  dealsupdateId: any;
  dealByIdData: any;
  isImagePopup: boolean = false;
  public editorValue: string = '';
  thumbnailOptions: FancyImageUploaderOptions;

  constructor(private __fb: FormBuilder, private __ds: DataServiceService, private __ms: MainServiceService, private __actRoute: ActivatedRoute,
    private __router: Router, private __toastServ: ToasterService) {
    this.currentUser = jwt_decode(localStorage.getItem('currentUser')).id;
  }
  ngOnInit() {
    this.dealsForm = this.__fb.group({
      name: ['', Validators.required],
      metaTitle: ['', Validators.required],
      metaKeywords: ['', Validators.required],
      metaDescription: ['', Validators.required],
      description: ['', Validators.required],
      status: [''],
      sort: ['', Validators.required],
      url: ['', Validators.required],
      imageAlt: ['', Validators.required],
      imageTitle: ['', Validators.required],
      activationDate: ['', Validators.required],
      deActivationDate: ['', Validators.required],
      shortDescription: ['', Validators.required],
    });
    this.params = this.__actRoute.params.subscribe(params => {
      this.dealsupdateId = this.__actRoute.snapshot.queryParams.id; // (+) converts string 'id' to a number
      if (this.dealsupdateId) {
        this.__ds.getData(this.__ms.url + 'Cms/dealById/?id=' + this.dealsupdateId).subscribe(res => {
          if (res) {
            this.dealsForm.controls['name'].setValue(res.data['name']);
            this.dealsForm.controls['metaTitle'].setValue(res.data['metaTitle']);
            this.dealsForm.controls['metaKeywords'].setValue(res.data['metaKeywords']);
            this.dealsForm.controls['metaDescription'].setValue(res.data['metaDescription']);
            this.dealsForm.controls['shortDescription'].setValue(res.data['shortDescription']);
            this.dealsForm.controls['description'].setValue(res.data['description']);
            this.dealsForm.controls['imageAlt'].setValue(res.data['imageAlt']);
            this.dealsForm.controls['imageTitle'].setValue(res.data['imageTitle']);
            let status = (res.data['status'] == 1 ? true : false);
            this.dealsForm.controls['status'].setValue(status);
            this.dealsForm.controls['sort'].setValue(res.data['sort']);
            this.dealsForm.controls['url'].setValue(res.data['URL']);
            this.dealsForm.controls['activationDate'].setValue(res.data['test']);
            let activationDate = res.data['activationDate'];
            let deActivationDate = res.data['deActivationDate'];
            this.dealsForm.controls['activationDate'].setValue(new Date(activationDate));
            this.dealsForm.controls['deActivationDate'].setValue(new Date(deActivationDate));
          }
        });
      }
    });
    this.thumbnailOptions = {
      thumbnailHeight: 322,
      thumbnailWidth: 322,
      uploadUrl: this.__ms.uploadUrl + "Cms/uploadDealImg/" + this.dealsupdateId,
    };
  }
  // Upload Deal Thumbnail Image
  onUpload(file: UploadedFile) {
    console.log(file.response);
  }

  addDeals(forminputs) {
    if (this.dealsForm.valid) {
      console.log('acti', forminputs.activationDate);
      let activationDate = this.__ds.setDateFormat(forminputs.activationDate);
      let deActivationDate = this.__ds.setDateFormat(forminputs.deActivationDate);
      this.dealData = {
        'ID': this.dealsupdateId,
        'name': forminputs.name,
        'metaTitle': forminputs.metaTitle,
        'metaKeywords': forminputs.metaKeywords,
        'metaDescription': forminputs.metaDescription,
        'shortDescription': forminputs.shortDescription,
        'description': forminputs.description,
        'status': forminputs.status,
        'imageAlt': forminputs.imageAlt,
        'imageTitle': forminputs.imageTitle,
        'createdBy': this.currentUser,
        'sort': forminputs.sort,
        'activationDate': activationDate,
        'url': forminputs.url,
        'deActivationDate': deActivationDate,
      }
      return this.__ds.postData(this.__ms.url + 'Cms/newDeals', this.dealData).subscribe(res => {
        console.log('response', res.data);
        this.__toastServ.pop('success', 'Insert / Update', res.message);
        this.dealsupdateId = res.data;
        this.isImagePopup = true;
        // this.__router.navigate(['/deals']);
      });
    } else {
      this.__toastServ.pop('error', 'Error Info', `Please fill-out all the required fields`);
    }
  }
}
