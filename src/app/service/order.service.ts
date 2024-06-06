import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {StockListing} from "./stock.service";

import {
  CapitalProfitDto,
  DecideOrderResponse,
  OrderDto, PublicCapitalDto,
  SellingRequest,
  StatusRequest
} from "../model/model";

import {BankAccountDto, CreateOrderRequest, ListingType, Order, OrderType, User} from "../model/model";
import {map} from "rxjs/operators";
import {number} from "zod";
import {PopupService} from "./popup.service";


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private popUpService: PopupService) { }




  fetchUserForLimit(id: string): Observable<User> {
    const jwt = sessionStorage.getItem("jwt");

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${jwt}`
      })
    };
    return this.http.get<User>(environment.userService + '/employee/' + id, httpOptions);
  }



  async getOrderHistory() {

    const jwt = sessionStorage.getItem("jwt");

    if(!jwt) return [];

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    let resp;
    try {
      resp = (await firstValueFrom(
        this.http.get(environment.userService + "/orders/getAll", {headers})
      )) as OrderDto[];
    } catch (e) {
      return [];
    }
    return resp;
  }
  async getAllOrdersHistory() {
    const jwt = sessionStorage.getItem("jwt");

    if(!jwt) return [];

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    let resp;
    try {
      resp = (await firstValueFrom(
        this.http.get(environment.userService + "/orders/supervisor/getAll", {headers})
      )) as OrderDto[];
    } catch (e) {
      return [];
    }
    return resp;
  }

  async getOrdersHistory() {
    const jwt = sessionStorage.getItem("jwt");

    if(!jwt) return [];

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    let resp;
    try {
      resp = (await firstValueFrom(
        this.http.get(environment.userService + "/orders/getAll", {headers})
      )) as OrderDto[];
    } catch (e) {
      return [];
    }
    return resp;
  }

  async getOrderRequests() {
    const jwt = sessionStorage.getItem("jwt");

    if(!jwt) return [];

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    let resp;
    try {
      resp = (await firstValueFrom(
        this.http.get("/assets/orderRequests.json")
      )) as OrderDto[];
    } catch (e) {
      return [];
    }
    return resp;
  }

  async getOrderSecurities() {
    const jwt = sessionStorage.getItem("jwt");

    if(!jwt) return [];

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    let resp;
    try {
      resp = (await firstValueFrom(
        this.http.get("/assets/orderSecurities.json")
      )) as OrderDto[];
    } catch (e) {
      return [];
    }
    return resp;
  }

  async approveOrder(orderId: number, request: StatusRequest): Promise<DecideOrderResponse> {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });


    try {
      return await firstValueFrom(
        this.http.put<DecideOrderResponse>(environment.userService + '/orders/decideOrder/' + orderId, {"status": "APPROVED"}, { headers })
      );
    } catch (error) {
      console.error('Error while approving order:', error);
      throw error;
    }
  }

  async denyOrder(orderId: number, request: StatusRequest): Promise<DecideOrderResponse>{
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    try {
      return await firstValueFrom(
        this.http.put<DecideOrderResponse>(environment.userService + '/orders/decideOrder/' + orderId, {"status": "DENIED"}, { headers })
      );
    } catch (error) {
      console.error('Error while denying order:', error);
      throw error;
    }

  }

  decideOrder(orderId: number, request: StatusRequest){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    return this.http.put<DecideOrderResponse>(environment.userService + '/orders/decideOrder/' + orderId, {"status": request}, {headers});
  }

  async buyOrder(orderType: OrderType, listingId: string, listingType: ListingType, contractSize: number, limitValue: number, stopValue: number, allOrNone: boolean) {
    const jwt = sessionStorage.getItem("jwt");

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${jwt}`
      })
    };

    const orderRequest: CreateOrderRequest = {
      orderType: orderType,
      listingId: listingId,
      listingType: listingType,
      contractSize: contractSize,
      limitValue: limitValue,
      stopValue: stopValue,
      allOrNone: allOrNone
    };


    try {
      const response = await this.http.post<boolean>(
        environment.userService + '/orders', orderRequest, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async buyOrderOptions(listingId: string, contractSize: number) {
    const jwt = sessionStorage.getItem("jwt");

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${jwt}`
      })
    };

    const orderRequest = {
      orderType: OrderType.BUY,
      listingId: listingId,
      listingType: ListingType.OPTIONS,
      contractSize: contractSize,
      limitValue: null,
      stopValue: null,
      allOrNone: false
    };

    console.log("buy options")
    console.log(orderRequest)


    try {
      const response = await this.http.post<boolean>(
        environment.userService + '/orders', orderRequest, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async sellOrder(orderType: OrderType, listingId: string, listingType: ListingType, contractSize: number, limitValue: number, stopValue: number, allOrNone: boolean) {
    const jwt = sessionStorage.getItem("jwt");

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${jwt}`
      })
    };

    const orderRequest: CreateOrderRequest = {
      orderType: orderType,
      listingId: listingId,
      listingType: listingType,
      contractSize: contractSize,
      limitValue: limitValue,
      stopValue: stopValue,
      allOrNone: allOrNone
    };
    console.log("sell order")
    console.log(orderRequest)

    try {
      const response = await this.http.post<boolean>(
        environment.userService + '/orders', orderRequest, httpOptions).toPromise();
      return response;
    } catch (error) {
      // @ts-ignore
      this.popUpService.openPopup("Error", error.error);
      // console.error(error);
      return false;
    }
  }



  getSecurityOrdersMock(): Observable<CapitalProfitDto[]> {
    return this.http.get<CapitalProfitDto[]>('assets/mocked_banking_data/orders-security-mocked.json')
      .pipe(
        map((data: CapitalProfitDto[]) => data.map(item => ({
          ...item,
          listingType: ListingType[item.listingType as keyof typeof ListingType] // Assuming listingType in JSON is a string that matches enum keys
        })))
      );
  }

  getSecurityOrders(): Observable<CapitalProfitDto[]> {
    const jwt = sessionStorage.getItem("jwt");

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${jwt}`
      })
    };

    return this.http.get<CapitalProfitDto[]>(environment.userService + '/capital/listings', httpOptions)
      .pipe(
        map((data: CapitalProfitDto[]) => data.map(item => ({
          ...item,
          listingType: ListingType[item.listingType as keyof typeof ListingType] // Assuming listingType in JSON is a string that matches enum keys
        })))
      );
  }


  getPublicStocks(): Observable<PublicCapitalDto[]> {
    const jwt = sessionStorage.getItem("jwt");

    const httpOptions = {
      headers: new HttpHeaders({
          'Authorization': `Bearer ${jwt}`
      })
    };
    return this.http.get<PublicCapitalDto[]>(environment.userService + '/capital/public/all', httpOptions);
  }

  //
  getAllStocks(): Observable<StockListing[]> {
    const jwt = sessionStorage.getItem("jwt");

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${jwt}`
      })
    };
    return this.http.get<StockListing[]>(environment.marketService + '/market/listing/get/stock', httpOptions);
  }


  changePublicValue(listingType: ListingType, listingId: number, publicValue: number): Observable<boolean> {
    const jwt = sessionStorage.getItem("jwt");

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${jwt}`
      })
    };

    const body = {
      listingType: listingType,
      listingId: listingId,
      addToPublic: publicValue
    }

    console.log("change public value")
    console.log(body)
    return this.http.put<boolean>(environment.userService + '/capital/customer/addPublic', body, httpOptions);
  }




}
