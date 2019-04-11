import { MainServiceService } from './../services/main.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { DataServiceService } from '../services/data-service.service';

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})
export class TestFormComponent implements OnInit {

  testForm: FormGroup;
  
  // formData = [
  //   {		
  //     id:'1',
  //     name:'General Amenities',
  //     sub:[
  //       {
  //         id:'1',
  //         name:'Clothes rack'
  //       },
  //       {
  //         id:'2',
  //         name:'Drying rack for clothing'
  //       },
  //       {
  //         id:'3',
  //         name:'Fold-up bed'
  //       },
  //       {
  //         id:'4',
  //         name:'Air conditioning'
  //       },
  //       {
  //         id:'5',
  //         name:'Wardrobe\/Closet'
  //       }
  //     ]
  //   },
      
  //   {	
  //     id:'2',
  //     name:'Media & Technology',
  //     sub:[
  //         {
  //           id:'34',
  //           name:'Computer'
  //         },
  //         {
  //           id:'35',
  //           name:'Game console'
  //         },
  //         {
  //           id:'36',
  //           name:'Game console - Nintendo Wii'
  //         }
  //       ]
  //   },
  // ];

  testData:any = []
  insertedRooms:any = [];

  // insertedRooms = [{"id":"50","room_name":"Budget Single Room"},{"id":"51","room_name":"Business Double Room with Gym Privileges"}];

  mainFacility:FormGroup;
  sub:FormGroup;
  showRooms:boolean = false;

  checkCount:number;
  
  constructor(private fb: FormBuilder, private dataService: DataServiceService, 
    private mainService: MainServiceService) { }

  ngOnInit() {
    // get room Facilities
    this.dataService.getData(this.mainService.url+'HotelLists/roomFacilities')
    .subscribe((data) => {
      // console.log(data)
      this.testData = data
    });   
    this.createForm('');
  } // onInit

  getFormData(){
    this.dataService.getData(this.mainService.url+'HotelLists/roomFacilities')
    .subscribe((data) => {
      this.getRoomList()
      this.createForm(data)
    });
    
  }

  getRoomList() {
    this.dataService.getData(this.mainService.url+'HotelLists/insertedRooms/?id=41')
    .subscribe((data) => {
      this.insertedRooms = data;
    });
  }

  createForm(formData) {
    let fac_arr = [];
    for(let i = 0; i < formData.length; i++){
      fac_arr.push(this.mainFacilities(formData[i]));
    }
    this.testForm = this.fb.group({
      formId: [],
      extra_bed: [],
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
    let roomsFac = [];
    for(let i = 0; i < this.insertedRooms.length; i++){
      console.log(i)
      console.log(this.insertedRooms[i])
      roomsFac.push(this.roomFacility(this.insertedRooms[i]));
    }
    return this.fb.group({
      id: [subData.id],
      name: [subData.name],
      value:[],
      option: ['1'],
      roomOpt:[false],
      roomFacilities: this.fb.array(roomsFac)
    })
  }

  roomFacility(roomFac): FormGroup {
    console.log(roomFac);
    return this.fb.group({
      id: [roomFac.id],
      name: [roomFac.room_name],
      value: []
    })
  }

  // countChecked() {
  //   this.checkCount = 0;
  //   this.formData.forEach(item=>{
  //     console.log(item)
  //     if(item.checked){
  //       this.checkCount= this.checkCount+1
  //     }  
  //   } )
  // }

  showData(){
    console.log(this.testForm.value);
  }
  

}
