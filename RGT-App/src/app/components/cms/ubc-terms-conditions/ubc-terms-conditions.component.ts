import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { DataServiceService } from 'app/services/data-service.service';
import { MainServiceService } from 'app/services/main.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-ubc-terms-conditions',
  templateUrl: './ubc-terms-conditions.component.html',
  styleUrls: ['./ubc-terms-conditions.component.css']
})
export class UbcTermsConditionsComponent implements OnInit {
  T_CForm: FormGroup;
  TCformData: object;
  getId: any;
  termsLists: any;
  parseTermsLists: any;
  displayedColumns = ['S.No', 'terms', 'notes', 'pkgIncludes', 'requirements', 'status', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private fb: FormBuilder, private ds: DataServiceService, private ms: MainServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.ds.getData(this.ms.url + 'cms/umrahTermsConditions').subscribe(res => {
      this.getId = res.data['ID'];
      this.T_CForm.controls['termCondition'].setValue(res.data['termsCondition']);
      this.T_CForm.controls['notes'].setValue(res.data['notes']);
      this.T_CForm.controls['pkgIncludes'].setValue(res.data['pkgIncludes']);
      this.T_CForm.controls['requirements'].setValue(res.data['requirements']);
    });

    this.T_CForm = this.fb.group({
      termCondition: ['', Validators.required],
      notes: ['', Validators.required],
      pkgIncludes: ['', Validators.required],
      requirements: ['', Validators.required],
    });
  }
  addT_C(forminputs) {
    if (this.T_CForm.valid) {
      this.TCformData = {
        'ID': this.getId,
        'termCondition': forminputs.termCondition,
        'notes': forminputs.notes,
        'pkgIncludes': forminputs.pkgIncludes,
        'requirements': forminputs.requirements,
      }
      return this.ds.postData(this.ms.url + 'cms/addNewTerms', this.TCformData).subscribe(res => {
        console.log(res);
      })
    }
  }
}
