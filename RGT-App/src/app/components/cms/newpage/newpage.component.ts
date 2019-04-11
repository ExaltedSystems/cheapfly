import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';
import { DataServiceService } from '../../../services/data-service.service';
import { MainServiceService } from '../../../services/main.service';
import { User } from '../../../models/index';
import * as jwt_decode from 'jwt-decode';
import { Router, ActivatedRoute } from '@angular/router/';
import { CKEditorModule } from 'ngx-ckeditor';
import { FileHolder } from 'angular2-image-upload/lib/image-upload/image-upload.component';
import { ToasterService } from 'angular2-toaster/src/toaster.service';
@Component({
  selector: 'app-newpage',
  templateUrl: './newpage.component.html',
  styleUrls: ['./newpage.component.css']
})
export class NewpageComponent implements OnInit {
  pageUrl: string;
  newPage: FormGroup;
  currentUser: User;
  param: any;
  btnSubmitError: string = '';
  successErrorMsg: string = '';
  isParent: number = 0;
  newPageData: object;
  editPageId: any = '';
  pageData: any = '';
  parentList: any;
  pgLevel: any;
  fileName: any;
  display: boolean = false;
  options: FancyImageUploaderOptions = {
    thumbnailHeight: 322,
    thumbnailWidth: 322,
    uploadUrl: this.__ms.url + 'Cms/uploadPic',
    allowedImageTypes: ['image/png', 'image/jpeg'],
    maxImageSize: 3
  };

  constructor(private __fb: FormBuilder, private __ds: DataServiceService, private __ms: MainServiceService,
    private __actRoute: ActivatedRoute, private __toastServ: ToasterService, private __router: Router) {
    this.currentUser = jwt_decode(localStorage.getItem('currentUser')).id;
  }

  ngOnInit() {
    this.__ds.getData(this.__ms.url + 'Cms/getAllCategoryLists').subscribe(res => {
      this.parentList = res.data;
    });
    this.newPage = this.__fb.group({
      name: ['', Validators.required],
      parentId: [''],
      metaTitle: ['', Validators.required],
      metaKeywords: ['', Validators.required],
      metaDescription: ['', Validators.required],
      url: [''],
      pageSort: ['', Validators.required],
      status: ['', Validators.required],
      shortDescription: ['', Validators.required],
      description: ['', Validators.required],
      // file: ['', Validators.required]
    });
    this.param = this.__actRoute.params.subscribe(urlId => {
      this.editPageId = this.__actRoute.snapshot.queryParams.id;
    });
    if (this.editPageId) {
      this.__ds.getData(this.__ms.url + 'cms/webCatById/?id=' + this.editPageId).subscribe(res => {
        this.newPage.controls['name'].setValue(res['data']['name']);
        this.newPage.controls['metaTitle'].setValue(res['data']['metaTitle']);
        this.newPage.controls['metaKeywords'].setValue(res['data']['metaKeywords']);
        this.newPage.controls['metaDescription'].setValue(res['data']['metaDescription']);
        this.newPage.controls['shortDescription'].setValue(res['data']['shortDescription']);
        this.newPage.controls['description'].setValue(res['data']['description']);
        this.newPage.controls['parentId'].setValue(res['data']['categoryId']);
        this.newPage.controls['pageSort'].setValue(res['data']['sort']);
        this.newPage.controls['url'].setValue(res['data']['URL']);
        this.newPage.controls['status'].setValue(res['data']['status']);
      });
    }
  }
  showDialog() {
    this.display = true;
}
  onUpload(file: UploadedFile) {
    console.log(file.response);
  }
  addNewPage(formData) {
    if (this.newPage.valid) {
      this.newPageData = {
        'ID': this.editPageId,
        'name': formData.name,
        'metaTitle': formData.metaTitle,
        'metaKeywords': formData.metaKeywords,
        'metaDescription': formData.metaDescription,
        'shortDescription': formData.shortDescription,
        'description': formData.description,
        'image': formData.image,
        'imageAlt': formData.imageAlt,
        'imageTitle': formData.imageTitle,
        'parentId': formData.parentId,
        'sort': formData.pageSort,
        'URL': formData.url,
        'createdBy': this.currentUser,
        'status': formData.status,
      }
      return this.__ds.postData(this.__ms.url + 'Cms/addPage', this.newPageData)
        .subscribe(res => {
          // this.successErrorMsg = res.message;
          this.__toastServ.pop('success', 'Insert / Update', res.message);
          // this.__router.navigate(['/pages']);

        });
    } else {
      this.__toastServ.pop('error', 'Error Info', `Please fill-out all the required fields`);
      // this.btnSubmitError = 'Please fill all the required fields....!';
      this.newPage.controls['name'].markAsTouched();
      this.newPage.controls['parentId'].markAsTouched();
      this.newPage.controls['metaTitle'].markAsTouched();
      this.newPage.controls['metaKeywords'].markAsTouched();
      this.newPage.controls['metaDescription'].markAsTouched();
      this.newPage.controls['url'].markAsTouched();
      this.newPage.controls['pageSort'].markAsTouched();
      this.newPage.controls['status'].markAsTouched();
      this.newPage.controls['description'].markAsTouched();
    }
  }
  onRemoved(file) {
    // do some stuff with the removed file.
  }
  onUploadStateChanged(state) {
    console.log(state);
  }
  onUploadFinished(file: FileHolder) {
    console.log(file);
  }
  imageFinishedUploading(finish) {
  }
  fileChangeEvent(fileInput: any) {
    console.log(this.fileName = fileInput.target.files[0]);
  }
  //get url according to name
  onselect(event) {
    let slctd = event.target;
    this.pageUrl = slctd.options[slctd.selectedIndex].dataset.id;
    // console.log(dataset.id);
    this.newPage.controls['url'].setValue(this.pageUrl);
  }
  // Get Parent Id from Pages where parentId = 0
  getPageParents() {
    // Get Page Parents
    return this.__ds.postData(this.__ms.url + 'Cms/pageParentId_get', {})
      .subscribe((data) => {
        console.log(data);
      });
  }
  // File Upload Function
  onFileChange(event) {
    console.log('FileChange:', event)
    let reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.newPage.patchValue({
          file: reader.result
        });
        // need to run CD since file load runs outside of zone
        // this.__cd.markForCheck();
      };
    }
  }

}
