import { Component, OnInit } from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  partData: any;
  showDetails = false;
  options: string[];
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.showDetails = false;
  }
  fetchOptions(event: any) {
    this.options = [];
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    const body = {
      SearchByPartRequest: {
        mouserPartNumber: event.target.value
      }
    };

    this.http.post('https://api.mouser.com/api/v1/search/partnumber?apiKey=3bef6d5b-61bc-4b30-8e02-ddc2c7b2b567', body,
      httpOptions).subscribe((data: any) => {
        if(data.SearchResults){
          for ( let i = 0 ; i < data.SearchResults.Parts.length; i++) {
            this.options.push(data.SearchResults.Parts[i].ManufacturerPartNumber);
          }
        }
        console.log(data);
      }, error => {
        console.log(error);
      });

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
      httpOptions).subscribe((data: any) => {
        console.dir(data);
        this.showDetails = true;
        this.partData = data.SearchResults.Parts[0];
        console.log(this.partData);
      }, error => {
        console.log(error);
      });
  }

}
