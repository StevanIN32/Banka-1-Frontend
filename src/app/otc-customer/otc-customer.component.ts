import { Component } from '@angular/core';
import { DatePipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { FilterByStatusPipeModule } from '../orders/FilterByStatusPipe';
import { OrangeButtonModule } from '../welcome/redesign/OrangeButton';
import { TableComponentModule } from '../welcome/redesign/TableComponent';
import { TransformSecuritiesPipeModule } from '../orders/TransformSecuritiesPipe';
import {
  Contract, Customer, CustomerWithAccounts, Order,
  OTC,
  OTCTab, PublicCapitalDto,
  PublicOffer,
  StockListing, User,
} from '../model/model';
import { OtcService } from '../service/otc.service';
import { StockService } from '../service/stock.service';
import {forkJoin, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { TableComponentStatusModule } from '../welcome/redesign/TableComponentStatus';
import { PopupService } from '../service/popup.service';
import {CustomerService} from "../service/customer.service";
import {environment} from "../../environments/environment";
import {OrderService} from "../service/order.service";
import {TransformPublicSecuritiesPipeModule} from "../orders/TransformPublicSecuritiesPipe";
import {any, string} from "zod";

@Component({
  selector: 'app-otc',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    FilterByStatusPipeModule,
    NgForOf,
    NgIf,
    OrangeButtonModule,
    TableComponentModule,
    TransformSecuritiesPipeModule,
    TableComponentStatusModule,
    TransformPublicSecuritiesPipeModule,
  ],
  templateUrl: './otc-customer.component.html',
  styleUrl: './otc-customer.component.css',
})
export class OtcCustomerComponent {
  headersOTCs = [
    'Owner',
    'Stock',
    'Outstanding Shares',
    'Exchange Name',
    'Divided Yield',
  ];
  headersPublic = [
    'Security',
    'Symbol',
    'Amount',
    'Price',
    'Last Modified',
    'Owner',
  ];
  headersShares = [
    'Owner',
    'Stock',
    'Outstanding Shares',
    'Exchange Name',
    'Last Divided Yield',
  ];

  selectedTab: string = 'public';
  otcToContractIdMap: Map<OTC, number> = new Map();
  contracts: Contract[] = [];
  stocks: StockListing[] = [];
  otcs: OTC[] = [];
  publicOffers: PublicOffer[] = [];
  publicSecurities: any[] = [];
  orders: Order[] = []; // Assuming you have a list of orders

  activeSell: OTC[] = [];
  activeBuy: OTC[] = []

  customer: CustomerWithAccounts = {} as CustomerWithAccounts;


  constructor(
    private otcService: OtcService,
    private customerService: CustomerService,
    private stockService: StockService,
    private http: HttpClient,
    private popup: PopupService,
    private orderService: OrderService
  ) {}

  async ngOnInit() {
    this.initializeCustomer();
    this.loadOTCs();
    // this.loadPublicOffers();
    // this.loadActiveBuy();
    // this.loadActiveSell();
    this.getPublicSecurities();
  }

  private initializeCustomer(): void {
    this.customerService.getCustomer2().subscribe({
      next: (customer) => {
        this.customer = customer;
        console.log('Customer:', customer);
        console.log("Load active sell");
        console.log(this.customer);
        console.log(this.otcs);
        if (this.customer && this.customer.accountIds && this.otcs.length > 0) {
          this.customer.accountIds.forEach(account => {
            const matchingOtcs = this.otcs.filter(otc => otc.owner === account.accountNumber);
            if (matchingOtcs.length > 0) {
              console.log(`Matching OTCs for account ${account.accountNumber}:`, matchingOtcs);
              this.activeSell = matchingOtcs.filter(otc => otc.status !== 'approved' && otc.status !== 'denied');
              this.activeBuy = matchingOtcs;
            }
          });
        } else {
          console.log("Nema customera ili otca");
        }
      },
      error: (error) => {
        console.error('Error fetching customer:', error);
      }
    });
  }

  async loadOTCs() {
    // forkJoin({
    //   contracts: this.http.get<Contract[]>(
    //     '/assets/mocked_banking_data/contracts-mocked.json'
    //   ),
    //   stocks: this.http.get<StockListing[]>(
    //     '/assets/mocked_banking_data/stocks-mocked.json'
    //   ),
    // }).subscribe(({ contracts, stocks }) => {
    //   console.log('Contracts:', contracts);
    //   console.log('Stocks:', stocks);
    //   this.contracts = contracts;
    //   this.stocks = stocks;
    //   this.otcs = this.mergeLists(contracts, stocks);
    //   console.log('OTCs:', this.otcs);
    // });
    forkJoin({
      contracts: this.otcService.getAllCustomerContracts(),
      stocks: this.stockService.getStocks()
    }).subscribe(({ contracts, stocks }) => {
      this.contracts = contracts;
      this.stocks = stocks;
      this.otcs = this.mergeLists(contracts, stocks);
      // console.log('Contracts:', contracts);
      // console.log('Stocks:', stocks);
      // console.log('OTCs:', this.otcs);
    });

  }

  // async loadPublicOffers() {
  //   this.http
  //     .get<PublicOffer[]>('/assets/mocked_banking_data/public-offers.json')
  //     .subscribe((offers) => {
  //       this.publicOffers = offers;
  //     });
  // }
  getPublicSecurities() {
    this.orderService.getPublicStocks().subscribe(res => {
      this.publicSecurities = res;
    })
  }

  // async getPublicSecurities() {
  //   const jwt = sessionStorage.getItem("jwt");
  //
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Authorization': `Bearer ${jwt}`
  //     })
  //   };
  //   this.http.get<PublicCapitalDto[]>(`${environment.userService}/capital/public/listing/all`, httpOptions)
  //     .subscribe({
  //       next: (offers) => {
  //         this.publicSecurities = offers;
  //         this.matchPublicSecuritiesWithOrders();
  //         console.log(this.orders);
  //       },
  //       error: (error) => {
  //         console.error('Error fetching public securities:', error);
  //       }
  //     });
  //
  // }
  // private matchPublicSecuritiesWithOrders(): void {
  //   this.publicSecurities.forEach(security => {
  //     const matchingOrders = this.orders.filter(order => order.listingId === security.listingId);
  //     if (matchingOrders.length > 0) {
  //       // Handle the matched orders as needed
  //     }
  //   });
  // }
  // async loadActiveSell() {
  //   // Customer->accountIds->accountNumber
  //   // I onda upored accountNumber sa svim contractima i ako se poklapa
  //   // Sad je pitanje ako je SELL onda offeri koje sam ja dobio
  //   // Ako je BUY onda offeri koje sam ja poslao
  //
  //   this.http
  //     .get<OTC[]>('/assets/mocked_banking_data/otc-mocked.json')
  //     .subscribe((offers) => {
  //       this.activeSell = offers;
  //     });
  // }
  //
  // async loadActiveBuy() {
  //   this.http
  //     .get<OTC[]>('/assets/mocked_banking_data/otc-mocked.json')
  //     .subscribe((offers) => {
  //       this.activeBuy = offers;
  //     });
  // }

  togglePopupOffer(row: any) {
    this.popup.openPublicSecuritiesPopup(row);
  }

  setTab(tabName: string) {
    this.selectedTab = tabName;
  }

  updateOTCStatus(otc: any, newStatus: 'Approved' | 'Denied') {
    if (otc.status === newStatus) return;

    const contractId = this.otcToContractIdMap.get(otc);
    console.log(otc);

    console.log('Contract ID:', contractId);

    if (contractId) {
      if (newStatus === 'Approved')
        this.otcService.approveOTC(contractId).subscribe(
          (response) => {
            console.log('Response to successfully changing status:' + response);
          },
          (error) => {
            console.error('Error updating status, this is response: ' + error);
          }
        );
      else
        this.otcService.denyOTC(contractId).subscribe(
          (response) => {
            console.log('Response to successfully changing status:' + response);
          },
          (error) => {
            console.error('Error updating status, this is response: ' + error);
          }
        );
    } else {
      console.error('Contract ID not found for OTC', otc);
    }

    for (let current of this.otcs) {
      if (current === otc) {
        current.status = newStatus;
        break;
      }
    }
    // this loop above or this below
    // this.loadOTCs();
  }

  mergeLists(contracts: Contract[], stocks: StockListing[]): OTC[] {
    const stockMap = new Map<number, StockListing>();

    this.stocks.forEach((stock) => {
      stockMap.set(stock.listingId, stock);
    });

    const result: OTC[] = [];

    this.contracts.forEach((contract) => {
      const stock = stockMap.get(contract.listingId);
      if (stock) {
        const otc: OTC = {
          owner: contract.buyerAccountNumber,
          stock: stock.name,
          outstandingShares: stock.outstandingShares.toString(),
          exchangeName: stock.exchangeName,
          dividendYield: stock.dividendYield.toString(),
          status: contract.bankApproval ? 'Approved' : 'Pending',
        };
        result.push(otc);
        console.log(otc);
        this.otcToContractIdMap.set(otc, contract.contractId);
      }
    });

    return result;
  }
}
