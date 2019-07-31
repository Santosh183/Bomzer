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
          if (this.rows[i].quantity < this.rows[i].mouser.priceBreakUp[j].Quantity) {
            this.rows[i].mouser.price = this.rows[i].mouser.priceBreakUp[j].Price;
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
    const body = {
      SearchByPartRequest: {
        mouserPartNumber: pNumber
      }
    };

    this.http.post('https://api.mouser.com/api/v1/search/partnumber?apiKey=3bef6d5b-61bc-4b30-8e02-ddc2c7b2b567', body,
      httpOptions).subscribe((data) => {
        console.dir(data);
        this.updateMouserValues(pNumber, data);
      }, error => {
        console.log(error);
      });
  }
  updateMouserValues(pNumber: string, data: any) {
    for(let i =0;i<this.rows.length;i++) {
      if((pNumber == this.rows[i].partNumber) ) {
        this.rows[i].mouser = {
          price: '',
          availableQuantity: '',
          leadTime: '',
          priceBreakUp: []
        };
        this.rows[i].partNumber = pNumber;
        this.rows[i].quantity = 1;
        this.rows[i].manufacturer = data.SearchResults.Parts[0].Manufacturer;
        this.rows[i].mouser.availableQuantity = data.SearchResults.Parts[0].Availability;
        this.rows[i].mouser.leadTime = data.SearchResults.Parts[0].LeadTime;
        this.rows[i].mouser.priceBreakUp = data.SearchResults.Parts[0].PriceBreaks;
        this.rows[i].mouser.price = data.SearchResults.Parts[0].PriceBreaks[0].Price +
        data.SearchResults.Parts[0].PriceBreaks[0].Currency;
      }
    }
  }
}
