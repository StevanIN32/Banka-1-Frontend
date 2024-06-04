import { HttpClient, HttpHeaders   } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer, LegalPerson} from '../model/model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LegalPersonService {

  constructor(private httpClient: HttpClient) { }

  //Get all legal persons mocked
  private getAllLegalPersonsMocked(): Observable<LegalPerson[]> {
    const url = `/assets/mocked_banking_data/mocked_legal_persons.json`;
    return this.httpClient.get<LegalPerson[]>(url);
  }

  //Get all legal persons using API call
  private getAllLegalPersonsFromApi(): Observable<LegalPerson[]> {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });
    console.log(headers);

    const options = { headers: headers };
    let url = environment.userService + `/company/all`;

    return this.httpClient.get<LegalPerson[]>(url, options);
  }

  //Depending on shouldUseMockedDataForLegalPersons a mocked or real data should be returned
  getAllLegalPersons(): Observable<LegalPerson[]>
  {
    if(environment.shouldUseMockedDataForLegalPersons)
    {
      return this.getAllLegalPersonsMocked();
    }
    else
    {
      return this.getAllLegalPersonsFromApi();
    }
  }

  //Save new legal persopn to DB
  saveNewLegalPerson(newLegalPerson: LegalPerson): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });
    return this.httpClient.post(environment.userService + '/company/create', {
      companyName: newLegalPerson.companyName,
      idNumber: newLegalPerson.idNumber,
      pib: newLegalPerson.pib,
      cba: newLegalPerson.cba,
      address: newLegalPerson.address
    },{
      headers: headers
    });
  }

  //Join leagal person and customer
  joinLegalPersonAndCustomer(legalPerson: LegalPerson, customer: Customer): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
    });

    const body = {legalPerson, customer};
    console.log(body);

    return this.httpClient.post(environment.userService + '/company/join', {
      customerEmail: customer.email,
      companyPib: legalPerson.pib
    },{
      headers: headers
    });
  }
}
