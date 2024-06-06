import { HttpClient, HttpHeaders   } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { environment } from '../../../environment';
// import { BankAccount, Exchange, Recipient, Payment, NewLimitDto } from '../model/model';
import {BankAccount, Exchange, Recipient, Payment, NewLimitDto, User, ContractCreateDto} from '../model/model';
import { environment } from '../../environments/environment';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  constructor(private httpClient: HttpClient) { }

  // Get all bank accounts MOCKED
  getUsersBankAccountsMocked(userId: number): Observable<BankAccount[]> {
    return this.httpClient.get<BankAccount[]>('/assets/mocked_banking_data/bank-accs-mocked.json');
  }

  // Get all bank accounts REAL_DATA
  getUsersBankAccounts(userId: number): Observable<BankAccount[]> {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });
    console.log(headers);

    const options = { headers: headers };
    let url = environment.userService + `/account/getCustomer/${userId}`;

    return this.httpClient.get<BankAccount[]>(url, options);
  }

  getAdminBankAccounts(companyId: number): Observable<BankAccount[]> {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });
    console.log(headers);

    const options = { headers: headers };
    let url = environment.userService + `/account/getCompany/${companyId}`;

    return this.httpClient.get<BankAccount[]>(url, options);
  }

  //Get all payments for bank account MOCKED
  getPaymentsForAccountMocked(accountNumber: string): Observable<Payment[]> {
    const url = `/assets/mocked_banking_data/mocked_transactions/transactions${accountNumber}.json`;
    return this.httpClient.get<Payment[]>(url);
  }

  //Get all payments for bank account REAL_DATA
  getPaymentsForAccount(accountNumber: string): Observable<Payment[]> {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    const options = { headers: headers };
    let url = environment.userService + `/payment/getAll/${accountNumber}`;

    console.log("getPaymentsForAccount log:");
    console.log(sessionStorage.getItem('jwt'))
    console.log(options);
    console.log(url);

    return this.httpClient.get<Payment[]>(url, options);
  }

  //Get all exchanges for bank account MOCKED
  getExchangesForAccountMocked(accountNumber: string): Observable<Exchange[]> {
    const url = `/assets/mocked_banking_data/mocked_exchanges/exchanges${accountNumber}.json`;
    return this.httpClient.get<Exchange[]>(url);
  }

  //Get all exchanges for bank account REAL_DATA
  getExchangesForAccount(accountNumber: string): Observable<Exchange[]> {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });
    console.log(headers);

    const options = { headers: headers };
    let url = environment.userService + `/transfer/getAll/${accountNumber}`;

    return this.httpClient.get<Exchange[]>(url, options);
  }

  //Get all recipients for user MOCKED
  getAllRecipientsMocked(): Observable<Recipient[]> {
    const url = `/assets/mocked_banking_data/recipients-mocked.json`;
    return this.httpClient.get<Recipient[]>(url);
  }

  getAllRecipients(): Observable<Recipient[]> {


    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });
    return this.httpClient.get<Recipient[]>(environment.userService + '/recipients/getAll',{
      headers: headers
    });

  }

  //Add recipient
  addRecipient(fistName: string, lastName: string, bankAccountNumber: string): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });
    return this.httpClient.post(environment.userService + '/recipients/add', {
      firstName: fistName,
      lastName: lastName,
      bankAccountNumber: bankAccountNumber
    },{
      headers: headers
    });
  }

  editRecipient(recipient: Recipient): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });
    return this.httpClient.put(environment.userService + '/recipients/edit', recipient,{
      headers: headers
    });
  }

  deleteRecipient(recipient: Recipient): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });
    return this.httpClient.delete(environment.userService + '/recipients/remove/'+recipient.id,{
      headers: headers
    });
  }



  addNewLimit(newLimitDto : NewLimitDto): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    console.log(headers);

    const options = { headers: headers };
    let url = environment.userService + `/employee/limits/newLimit`;

    return this.httpClient.put(url, {
      userId: newLimitDto.userId,
      approvalRequired: newLimitDto.approvalRequired,
      limit: newLimitDto.limit
    },{
      headers: headers
    });
  }

  resetLimit(userId: number): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    console.log(headers);

    const options = { headers: headers };
    let url = environment.userService + `/employee/limits/reset/${userId}`;

    return this.httpClient.put(url,null,{
      headers: headers
    }
    );
  }

  changeBankeAccountName(newName: string, bankAccountNumber: string): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    console.log(headers);

    const options = { headers: headers };
    let url = environment.userService + `/account`;

    return this.httpClient.put(url, {
      bankAccountNumber: bankAccountNumber,
      newName: newName
    },{
      headers: headers
    });
  }

  makeAnOfferCustomer(security: any, volume: number, offer: number){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });
    const options = { headers: headers };
    const body:  ContractCreateDto = {
      amountToBuy: volume,
      offerPrice: offer,
      bankAccountNumber: security.bankAccountNumber,
      listingId: security.listingId,
      listingType: security.listingType,
      ticker: security.ticker
    }
    console.log("makeAnOffer")
    console.log(body)
    return this.httpClient.post(environment.userService + "/contract/customer", body, options);
  }


  makeAnOfferEmployee(security: any, volume: number, offer: number) : Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });
    const options = {headers: headers};
    const body: ContractCreateDto = {
      amountToBuy: volume,
      offerPrice: offer,
      bankAccountNumber: security.bankAccountNumber,
      listingId: security.listingId,
      listingType: security.listingType,
      ticker: security.ticker
    }

    return this.httpClient.post(environment.userService + "/contract/employee", body, options);
  }

  makeAnOffer(security: any, volume: number, offer: number) {
    const jwt = sessionStorage.getItem('jwtToken');
    if (!jwt) {
      console.error('JWT token not found in session storage.');
      return;
    }

    const url = `${environment.userService}/contract/customer`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      })
    };

    const requestBody = {
      amountToBuy: volume,
      offerPrice: offer,
      bankAccountNumber: security.owner,
      listingId: security.listingId,
      listingType: security.listingType,
      ticker: security.symbol
    };

    return this.httpClient.post<{ result: boolean }>(url, requestBody, httpOptions).pipe(
      map(response => response.result)
    );
  }
}
