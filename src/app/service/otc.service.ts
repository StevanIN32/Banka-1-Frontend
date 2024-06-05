import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Contract, PublicCapitalDto} from "../model/model";

@Injectable({
  providedIn: 'root'
})
export class OtcService {
  private apiUrl = environment.userService;

  constructor(private http: HttpClient) { }

  getAllCustomerContracts() : Observable<Contract[]>{
    const jwt = sessionStorage.getItem("jwt");

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${jwt}`
      })
    };
    return this.http.get<Contract[]>(environment.userService + "/contract/customer/getAllContracts", httpOptions);
  }

  getAllSupervisorContracts() : Observable<Contract[]> {
    const jwt = sessionStorage.getItem("jwt");

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${jwt}`
      })
    };
    return this.http.get<Contract[]>(environment.userService + "/contract/supervisor/getAllContracts", httpOptions);

  }

  public denyOTC(contractId: number): Observable<boolean> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    const jsonData = {
      message: "Denied this contract."
    };

    return this.http.put<boolean>(`${this.apiUrl}/contract/deny/${contractId}`, jsonData, {headers});

  }

  public approveOTC(contractId: number): Observable<boolean> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    const jsonData = {
      message: "Admin approved this contract."
    };

    return this.http.put<boolean>(`${this.apiUrl}/contract/approve/${contractId}`, jsonData, {headers});
  }


  public acceptOTC(contractId: number): Observable<boolean> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    const jsonData = {
      message: "Customer accepted this contract."
    };

    return this.http.put<boolean>(`${this.apiUrl}/contract/accept/${contractId}`, jsonData,{headers});
  }
}
