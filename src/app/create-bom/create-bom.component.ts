import { Component, OnInit } from '@angular/core';
import { ValueRow } from '../valueRow.model';
import {HttpHeaders, HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-create-bom',
  templateUrl: './create-bom.component.html',
  styleUrls: ['./create-bom.component.scss']
})
export class CreateBomComponent implements OnInit {

  rows: ValueRow[];
  ifAddForm = false;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.rows = [];
    this.rows.push(new ValueRow());
  }
  addPart() {
     this.rows.push(new ValueRow());
  }
  updatePrice( pNumber: string) {
    for(let i =0;i<this.rows.length;i++) {
      if (pNumber == this.rows[i].partNumber) {
        for (let j = 0 ; j < this.rows[i].mouser.priceBreakUp.length; j++) {
          if (this.rows[i].quantity < this.rows[i].mouser.priceBreakUp[j].quantity) {
            this.rows[i].mouser.price = this.rows[i].mouser.priceBreakUp[j].price;
            break;
          }
        }
        for (let j = 0 ; j < this.rows[i].digikey.priceBreakUp.length; j++) {
          if (this.rows[i].quantity < this.rows[i].digikey.priceBreakUp[j].quantity) {
            this.rows[i].digikey.price = this.rows[i].digikey.priceBreakUp[j].price;
            break;
          }
        }
        break;
      }
    }

  }
  fetchValues(pNumber: string) {
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
      this.populateValues(pNumber, data);
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
  populateValues(pNumber: string, data: any) {
    for(let i =0;i<this.rows.length;i++) {
      if((pNumber == this.rows[i].partNumber) ) {
        this.rows[i].mouser = {
          price: '',
          availableQuantity: '',
          leadTime: '',
          priceBreakUp: []
        };
        this.rows[i].digikey = {
          price: '',
          availableQuantity: '',
          leadTime: '',
          priceBreakUp: []
        };
        this.rows[i].partNumber = data.partNumber;
        this.rows[i].quantity = 1;
        this.rows[i].manufacturer = data.manufacturer;
        if ( (data.mouser) && data.mouser.priceBreakUp.length > 0) {
          this.rows[i].mouser.availableQuantity = data.mouser.availableQuantity;
          this.rows[i].mouser.leadTime = data.mouser.leadTime;
          this.rows[i].mouser.priceBreakUp = data.mouser.priceBreakUp;
          this.rows[i].mouser.price = data.mouser.priceBreakUp[0].price;
        }
        if ((data.digikey) && data.digikey.priceBreakUp.length > 0) {
          this.rows[i].digikey.availableQuantity = data.digikey.availableQuantity;
          this.rows[i].digikey.leadTime = data.digikey.leadTime;
          this.rows[i].digikey.priceBreakUp = data.digikey.priceBreakUp;
          this.rows[i].digikey.price = data.digikey.priceBreakUp[0].price;
        }
      }
    }
  }
}
