import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {environment} from "../../environments/environment";

export interface ListingHistory {
  listingId: number;
  date: number; // Unix timestamp
  price: number;
  high: number;
  low: number;
  change: number;
  volume: number;
}

export interface StockListing {
  listingId: number;
  listingType: 'stock';
  ticker: string;
  name: string;
  exchangeName: string;
  lastRefresh: number; // UNIX timestamp
  price: number;
  high: number;
  low: number;
  priceChange: number;
  volume: number;
  outstandingShares: number;
  dividendYield: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private http: HttpClient) { }

  async getStocks(): Promise<StockListing[]>  {

    const jwt = sessionStorage.getItem("jwt");

    if(!jwt) return [];

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    let resp;
    try {
      resp = (await firstValueFrom(
        this.http.get(environment.marketService + "/market/listing/get/stock", {headers})
      )) as StockListing[];
    } catch (e) {
      return [];
    }
    resp.forEach(val => val.lastRefresh *= 1000);
    return resp;
  }

  async getStockHistory(stockId: number, from: number | null = null, to: number | null = null) {
    const jwt = sessionStorage.getItem("jwt");

    if(!jwt) return [];

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    let query = "?";

    if(from !== null) {
      query += "timestampFrom=" + from;
    }

    if(to !== null) {
      if(query.length > 1) query += "&"
      query += "timestampTo=" + to;
    }

    let resp;
    try {
      resp = (await firstValueFrom(
        this.http.get(environment.marketService + `/market/listing/history/stock/${stockId}` + query, {headers})
      )) as ListingHistory[];
    } catch (e) {
      return [];
    }
    return resp;
  }

  async getStockByTicker(stockId: number): Promise<StockListing | null> {
    const jwt = sessionStorage.getItem("jwt");

    if(!jwt) return null;

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    let resp;
    try {
      resp = (await firstValueFrom(
        this.http.get(environment.marketService + `/market/listing/stock/${stockId}`, {headers})
      )) as StockListing;
    } catch (e) {
      return null;
    }
    return resp;
  }
}
