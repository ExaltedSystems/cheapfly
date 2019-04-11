import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})
export class TestFormComponent implements OnInit {

  testForm: FormGroup;
  
  formData = [
    {		
      id:'1',
      name:'General Amenities',
      sub:[
        {
          id:'1',
          name:'Clothes rack',
          options:[
            {
              id: '1',
              option: 'All Rooms'
            },
            {
              id: '2',
              option: 'Some Rooms'
            }
          ]
        },
        {
          id:'2',
          name:'Drying rack for clothing',
          options:[
            {
              id: '1',
              option: 'All Rooms'
            },
            {
              id: '2',
              option: 'Some Rooms'
            }
          ]
        },
        {
          id:'3',
          name:'Fold-up bed',
          options:[
            {
              id: '1',
              option: 'All Rooms'
            },
            {
              id: '2',
              option: 'Some Rooms'
            }
          ]
        },
        {
          id:'4',
          name:'Air conditioning',
          options:[
            {
              id: '1',
              option: 'All Rooms'
            },
            {
              id: '2',
              option: 'Some Rooms'
            }
          ]
        },
        {
          id:'5',
          name:'Wardrobe\/Closet',
          options:[
            {
              id: '1',
              option: 'All Rooms'
            },
            {
              id: '2',
              option: 'Some Rooms'
            }
          ]
        }
      ]
    },
      
    {	
      id:'2',
      name:'Media & Technology',
      sub:[
          {
            id:'34',
            name:'Computer',
            options:[
            {
              id: '1',
              option: 'All Rooms'
            },
            {
              id: '2',
              option: 'Some Rooms'
            }
          ]
          },
          {
            id:'35',
            name:'Game console',
            options:[
            {
              id: '1',
              option: 'All Rooms'
            },
            {
              id: '2',
              option: 'Some Rooms'
            }
          ]
          },
          {
            id:'36',
            name:'Game console - Nintendo Wii',
            options:[
            {
              id: '1',
              option: 'All Rooms'
            },
            {
              id: '2',
              option: 'Some Rooms'
            }
          ]
          }
        ]
    },
  ];

  mainFacility:FormGroup;
  sub:FormGroup;
  
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm(this.formData);    
  }

  createForm(formData) {
    let fac_arr = [];
    for(let i = 0; i < this.formData.length; i++){
      fac_arr.push(this.mainFacilities(formData[i]));
    }
    this.testForm = this.fb.group({
      mainFacility: this.fb.array(fac_arr)
    })
  }
  

  mainFacilities(formData): FormGroup {
    let sub_arr = [];
    for(let i = 0; i < formData.sub.length; i++){
      sub_arr.push(this.subFacility(formData.sub[i]));
    }
    return this.fb.group({
      id: [formData.id],
      name: [formData.name],
      sub: this.fb.array(sub_arr)
    })
  }

  subFacility(subData): FormGroup {
    // let opt = [];
    // for(let i = 0; i < subData.options.length; i++){
    //   opt.push(this.facilityOptions(subData.options[i]));
    // }
    return this.fb.group({
      id: [subData.id],
      name: [subData.name],
      value:[],
      roomOpt:[false],
      option: []
    })
  }

  // facilityOptions(opt): FormGroup {
  //   return this.fb.group({
  //     id:[opt.id],
  //     option: [opt.option],
  //     value: []
  //   })
  // }

  showData(){
    console.log(this.testForm.value);
  }
  

}
