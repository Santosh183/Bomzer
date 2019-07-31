import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { ValueRow } from '../valueRow.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-upload-bom',
  templateUrl: './upload-bom.component.html',
  styleUrls: ['./upload-bom.component.scss']
})
export class UploadBomComponent implements OnInit {


  selectedFile: File;
  arrayBuffer: any;
  rows: ValueRow[];
  row: ValueRow;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.rows = [];
    this.row = new ValueRow();
  }

  incomingfile(event) {
    this.selectedFile = event.target.files[0];
  }


  Upload() {
    this.rows = [];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      let data = new Uint8Array(this.arrayBuffer);
      let arr = new Array();
      for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      let bstr = arr.join("");
      let workbook = XLSX.read(bstr, { type: "binary" });
      let first_sheet_name = workbook.SheetNames[0];
      let worksheet = workbook.Sheets[first_sheet_name];
      let parsedData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      for (let i = 0; i < parsedData.length; i++) {
        this.fetchValues(parsedData[i]["Part Number"], parsedData[i]["Quantity"]);
        console.log(parsedData[i]["Part Number"]);
        console.log(parsedData[i]["Quantity"]);
      }
    }
    fileReader.readAsArrayBuffer(this.selectedFile);
  }

  fetchValues(pNumber: string, quantity: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    /*
    const body = {
      SearchByPartRequest: {
        mouserPartNumber: pNumber
      }
    }; */

    this.http.get('http://ec2-3-94-187-199.compute-1.amazonaws.com/api/parts/getparts?partId=' + pNumber,
      httpOptions).subscribe((data) => {
        console.dir(data);
        this.populateValues(data, quantity);
      }, error => {
        console.log(error);
      });
    /*
    this.http.post('https://api.mouser.com/api/v1/search/partnumber?apiKey=3bef6d5b-61bc-4b30-8e02-ddc2c7b2b567', body,
      httpOptions).subscribe((data) => {
        console.dir(data);
        this.updateMouserValues(pNumber, data);
      }, error => {
        console.log(error);
      }); */
  }
  populateValues(data: any, quantity: string) {

    this.row = new ValueRow();
    this.row.mouser = {
      price: 'NA',
      availableQuantity: 'NA',
      leadTime: 'NA',
      priceBreakUp: []
    };
    this.row.digikey = {
      price: 'NA',
      availableQuantity: 'NA',
      leadTime: 'NA',
      priceBreakUp: []
    };
    this.row.partNumber = data.partNumber;
    this.row.quantity = parseInt(quantity, 10);
    this.row.manufacturer = data.manufacturer;
    if ((data.mouser) && data.mouser.priceBreakUp.length > 0) {
      this.row.mouser.availableQuantity = data.mouser.availableQuantity;
      this.row.mouser.leadTime = data.mouser.leadTime;
      this.row.mouser.priceBreakUp = data.mouser.priceBreakUp;
    }
    if ((data.digikey) && data.digikey.priceBreakUp.length > 0) {
      if ( data.digikey.availableQuantity.toString() === '0') {
        this.row.digikey.availableQuantity = 'None';
      } else {
        this.row.digikey.availableQuantity = data.digikey.availableQuantity + ' In Stock';
      }
      let temp = data.digikey.leadTime.split('weeks')[0].trim();
      if (temp !== '') {
        temp = parseInt(temp, 10) * 7 + ' Days';
      }
      this.row.digikey.leadTime = temp;

      this.row.digikey.priceBreakUp = data.digikey.priceBreakUp;
    }


    for (let j = 0; j < this.row.mouser.priceBreakUp.length; j++) {
      if (this.row.quantity < this.row.mouser.priceBreakUp[j].quantity) {
        this.row.mouser.price = this.row.mouser.priceBreakUp[j].price;
        break;
      }
    }
    if (this.row.quantity >= parseInt(this.row.mouser.priceBreakUp[this.row.mouser.priceBreakUp.length - 1].quantity, 10)) {
      this.row.mouser.price = this.row.mouser.priceBreakUp[this.row.mouser.priceBreakUp.length - 1].price;
    }
    for (let j = 0; j < this.row.digikey.priceBreakUp.length; j++) {
      if (this.row.quantity < this.row.digikey.priceBreakUp[j].quantity) {
        this.row.digikey.price = this.row.digikey.priceBreakUp[j].price;
        break;
      }
    }
    if (this.row.quantity >=
      parseInt(this.row.digikey.priceBreakUp[this.row.digikey.priceBreakUp.length - 1].quantity, 10)) {
      this.row.digikey.price = this.row.digikey.priceBreakUp[this.row.digikey.priceBreakUp.length - 1].price;
    }


    this.rows.push(this.row);
  }

}
