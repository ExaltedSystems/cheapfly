import { MainServiceService } from 'app/services/main.service';
import { DataServiceService } from 'app/services/data-service.service';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-ticket-report',
  templateUrl: './ticket-report.component.html',
  styleUrls: ['./ticket-report.component.css']
})
export class TicketReportComponent implements OnInit {
  dataSource = new MatTableDataSource();
  ticketReportData: any;
  parseTicketReportData: any;
  statusData: any;
  parsestatusData: any;
  filterKeys:any;
  reservationContactInfo:any;
  reservationTravellers :any;
  isRefNoPopup:  boolean = false;
  isStatusPopup: boolean = false;

  displayedColumns = ['sno', 'ref_no', 'pnr', 'first_name', 'last_name', 'dateTime', 'departDate', 'mobile', 'total_amount', 'Airline', 'Sectors', 'Status'];
  displayStatusColumns = ['sno', 'field', 'value'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private __ds: DataServiceService, private __ms: MainServiceService) { }

  ngOnInit() {
    this.getAllVisaDurations();
  }

  getAllVisaDurations() {
    this.__ds.getData('http://192.168.100.75/rgtapp/index.php/services/Ticket/onlineBookings').subscribe(res => {
      // console.log(res);
      this.ticketReportData = res;
      this.parseTicketReportData = new MatTableDataSource<Element>(this.ticketReportData);
      this.parseTicketReportData.paginator = this.paginator;
      // console.log(this.getdurationData);
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.parseTicketReportData.filter = filterValue;
  }
  myFunction(element, i) {
    let refData = {
      'ref_no': element.ref_no
    }
    // console.log(refData);
    this.__ds.postData('http://192.168.100.75/rgtapp/index.php/services/Ticket/ccResponse', refData).subscribe(res => {
       this.filterKeys =res;
      // console.log(this.filterKeys);
      // this.statusData = filterKeys;
      // this.parsestatusData = new MatTableDataSource<Element>(this.statusData);
      // this.parsestatusData.paginator = this.paginator;
    });
    this.isStatusPopup = true;
  }
  refNoData(element, i) {
    let refData = {
      'ref_no': element.ref_no
    }
    // console.log(refData);
    this.__ds.postData('http://192.168.100.75/rgtapp/index.php/services/Ticket/psgrDetails', refData).subscribe(res => {
       this.reservationContactInfo =res['contactInfo'];
       this.reservationTravellers = res['travellers'];
       console.log(this.reservationTravellers);
       console.log(this.reservationContactInfo);
      // this.statusData = filterKeys;
      // this.parsestatusData = new MatTableDataSource<Element>(this.statusData);
      // this.parsestatusData.paginator = this.paginator;
    });
    this.isRefNoPopup = true;
  }
}
