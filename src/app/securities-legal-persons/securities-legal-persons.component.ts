import { Component } from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {TableComponentModule} from "../welcome/redesign/TableComponent";
import {TransformForexPipe} from "../transform-forex.pipe";
import {TransformFuturePipe} from "../transform-future.pipe";
import {TransformOptionsPipe} from "../security-list/transform-options.pipe";
import {TransformSecurityPipe} from "../transform-security.pipe";
import {Forex, Future, ListingType, OptionsDto, OrderType, StockListing} from "../model/model";
import {Router} from "@angular/router";
import {SecurityService} from "../service/security.service";
import {OptionsService} from "../service/options.service";
import {OrderService} from "../service/order.service";
import {StockService} from "../service/stock.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PopupService} from "../service/popup.service";
import {environment} from "../../environments/environment";
import {OrangeButtonModule} from "../welcome/redesign/OrangeButton";

@Component({
  selector: 'app-securities-legal-persons',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    TableComponentModule,
    TransformFuturePipe,
    TransformOptionsPipe,
    TransformSecurityPipe,
    DatePipe,
    NgForOf,
    OrangeButtonModule,
  ],
  templateUrl: './securities-legal-persons.component.html',
  styleUrl: './securities-legal-persons.component.css'
})
export class SecuritiesLegalPersonsComponent {

  securities: StockListing[] = [];
  securitiesBackup: StockListing[] = [];
  selectedTab: string = 'stocks';
  symbol: string = '';

  futures: Future[] = [];
  futuresBackup: Future[] = [];
  _router: Router;

  forex: Forex[] = [];
  forexBackup: Forex[] = [];
  quoteCurrencyFilter: string = '';
  baseCurrencyFilter: string = '';

  options: any[] = [];

  isLegalPerson: boolean = false;

  constructor(
    private securityService: SecurityService,
    private optionsService: OptionsService,
    private orderService: OrderService,
    private stockService: StockService,
    private http: HttpClient,
    private popupService: PopupService,
    router: Router
  ) {
    this.isLegalPerson = sessionStorage.getItem('isLegalPerson') === 'true';

    if(!this.isLegalPerson){
      this.selectedTab = 'options'
    }
    this._router = router;
  }


  async ngOnInit() {
    await this.loadStocks();
    this.loadFutures();

    this.loadOptions()
  }

  async loadStocks(): Promise<void> {


    const stocks = await this.stockService.getStocks();

    console.log(stocks);

    this.securities = stocks;
    this.securitiesBackup = stocks;

    // this.stockMockData()
  }



  loadFutures(): void {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + sessionStorage.getItem('jwt'),
    });
    this.http
    this.http.get<Future[]>(environment.marketService + '/market/listing/get/futures',{ headers })
      .subscribe(
        (res) =>
          (this.futuresBackup = this.futures =
            res.map((val) => {
              val.settlementDate *= 1000;
              val.lastRefresh *= 1000;
              return val;
            }))
      );
    // this.mockFutureData()
  }



  loadOptions() {
    this.optionsService.getOptions().subscribe(response => {
      this.options = response;
    })
    // this.optionsDataMock()
  }


  setSelectedTab(tab: string) {
    console.log(tab);
    this.selectedTab = tab;
  }


  openBuyStockPopup(stockId: number): void{
    this.popupService.openBuyOrderPopup({id: stockId, type: ListingType.STOCK});
  }

  openBuyFuturePopup(futureId: number): void{
    this.popupService.openBuyOrderPopup({id: futureId, type: ListingType.FUTURE});
  }

  async buyOption(options: OptionsDto){
    let response = await this.orderService.buyOrderOptions(options.listingId.toString(), options.volume);
    if (response) {
      this.popupService.openCustomMessage({
        title: "Options",
        header: "Purchase Successful!",
        message: "Your stock option has been successfully bought."
      })
    } else {
      this.popupService.openCustomMessage({
        title: "Options",
        header: "Purchase Failed!",
        message: "You do not have sufficient funds to buy this stock option."
      })
    }
  }

  stockMockData(){
    const exp1: StockListing = {
      listingId: 123,
      listingType: 'stock',
      ticker: "AAPL",
      name: "NAME",
      exchangeName: "Exchange",
      lastRefresh: 123,
      price: 123,
      high: 123,
      low: 123,
      priceChange: 123,
      volume: 123,
      outstandingShares: 123,
      dividendYield: 123,
    }
    const exp2: StockListing = {
      listingId: 123,
      listingType: 'stock',
      ticker: "AAPL",
      name: "NAME",
      exchangeName: "Exchange",
      lastRefresh: 123,
      price: 123,
      high: 123,
      low: 123,
      priceChange: 123,
      volume: 123,
      outstandingShares: 123,
      dividendYield: 123,
    }
    const exp3: StockListing = {
      listingId: 123,
      listingType: 'stock',
      ticker: "AAPL",
      name: "NAME",
      exchangeName: "Exchange",
      lastRefresh: 123,
      price: 123,
      high: 123,
      low: 123,
      priceChange: 123,
      volume: 123,
      outstandingShares: 123,
      dividendYield: 123,
    }
    this.securities.push(exp1)
    this.securities.push(exp2)
    this.securities.push(exp3)
  }

  optionsDataMock(){
    const exp1: OptionsDto = {
      ticker: "string",
      optionType: "string",
      strikePrice: 123,
      currency: "string",
      impliedVolatility: 123,
      openInterest: 123,
      expirationDate: 1717024395,

      listingId: 123,
      listingType: "string",
      name: "string",
      exchangeName: "string",
      lastRefresh: 123,
      price: 123,
      high: 123,
      low: 123,
      priceChange: 123,
      volume: 123
    }
    const exp2: OptionsDto = {
      ticker: "string",
      optionType: "string",
      strikePrice: 123,
      currency: "string",
      impliedVolatility: 123,
      openInterest: 123,
      expirationDate: 1717024395,

      listingId: 123,
      listingType: "string",
      name: "string",
      exchangeName: "string",
      lastRefresh: 123,
      price: 123,
      high: 123,
      low: 123,
      priceChange: 123,
      volume: 123,
    }
    this.options.push(exp1)
    this.options.push(exp2)
  }

  mockFutureData(){
    const exp1 : Future = {
      listingId: 123,
      ticker: "string",
      listingType: "string",
      name: "string",
      exchangeName: "string",
      lastRefresh: 123,
      price: 123,
      high: 123,
      low: 123,
      priceChange: 123,
      volume: 123,
      contractSize: 123,
      contractUnit: "string",
      openInterest: 123,
      settlementDate: 123
    }
    const exp2 : Future = {
      listingId: 123,
      ticker: "string",
      listingType: "string",
      name: "string",
      exchangeName: "string",
      lastRefresh: 123,
      price: 123,
      high: 123,
      low: 123,
      priceChange: 123,
      volume: 123,
      contractSize: 123,
      contractUnit: "string",
      openInterest: 123,
      settlementDate: 123
    }

    this.futures.push(exp1);
    this.futures.push(exp2);

  }


}
