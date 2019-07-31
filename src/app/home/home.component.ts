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
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.showDetails = false;
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
