import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {CreateOrderRequest, ListingType, OptionsDto, OrderType, User} from "../model/model";
import {number} from "zod";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  constructor(private http: HttpClient) { }

  getOptions(): Observable<OptionsDto[]> {
    const jwt = sessionStorage.getItem("jwt");

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${jwt}`
      })
    };

    return this.http.get<OptionsDto[]>(environment.marketService + '/market/listing/get/options', httpOptions);
  }
}
