import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profit } from '../model/model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfitService {

  constructor(private httpClient: HttpClient) { }


  getAllProfit():Observable<number>{
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });
    console.log(headers);

    const options = { headers: headers };
    let url = environment.userService + `/profit/getStockProfitBank`;

    return this.httpClient.get<number>(url, options);
  }


  getAgentProfit(userId: number): Observable<number> {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });
    console.log(headers);

    const options = { headers: headers };
    let url = environment.userService + `/getStockProfitAgent/${userId}`;

    return this.httpClient.get<number>(url, options);
  }


}
