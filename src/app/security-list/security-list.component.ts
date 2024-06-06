import { Component } from '@angular/core';
import { Security, SecurityService } from '../service/security.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ForexTableComponent } from './components/forex-table/forex-table.component';
import { StockService } from '../service/stock.service';
import { FormsModule } from '@angular/forms';
import { StockTableComponent } from './components/stock-table/stock-table.component';
import { FutureTableComponent } from './components/future-table/future-table.component';
import { TableComponentModule } from '../welcome/redesign/TableComponent';
import { TransformSecurityPipe } from '../transform-security.pipe';
import {Forex, Future, ListingType, OptionsDto, OrderType, StockListing} from '../model/model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { TransformFuturePipe } from '../transform-future.pipe';
import { TransformForexPipe } from '../transform-forex.pipe';
import {PopupService} from "../service/popup.service";
import {TransformOptionsPipe} from "./transform-options.pipe";
import {OptionsService} from "../service/options.service";
import {OrderService} from "../service/order.service";

@Component({
  selector: 'app-security-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StockTableComponent,
    ForexTableComponent,
    FutureTableComponent,
    TableComponentModule,
    TransformSecurityPipe,
    TransformFuturePipe,
    TransformForexPipe,
    TransformOptionsPipe
  ],
  templateUrl: './security-list.component.html',
  styleUrl: './security-list.component.css',
})
export class SecurityListComponent {
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

  constructor(
    private securityService: SecurityService,
    private optionsService: OptionsService,
    private orderService: OrderService,
    private stockService: StockService,
    private http: HttpClient,
    private popupService: PopupService,
    router: Router
  ) {

      this.selectedTab = 'options'
    this._router = router;
  }

  searchFutures() {
    this.futures = this.futuresBackup.filter(
      (val) =>
        val.ticker.toLowerCase().includes(this.symbol.toLowerCase())
    );

  }

  searchForex() {
    this.forex = this.forexBackup.filter((value) => {
      return (
        value.ticker.toLowerCase().includes(this.symbol.toLowerCase())
      );
    });
  }

  searchStocks() {
    if (this.symbol.length === 0) this.securities = this.securitiesBackup;
    this.securities = this.securities.filter((stock) => {
      return stock.ticker.toLowerCase().includes(this.symbol.toLowerCase());
    });
  }

  search() {
    switch (this.selectedTab) {
      case 'future':
        this.searchFutures();
        break;
      case 'forex':
        this.searchForex();
        break;
      case 'stocks':
        this.searchStocks();
    }
  }

  async ngOnInit() {
    this.loadSecurities();
    this.loadFutures();
    this.loadForex();

    this.loadOptions()
  }

  async loadSecurities(): Promise<void> {


    const stocks = await this.stockService.getStocks();


    this.securities = stocks;
    this.securitiesBackup = stocks;

    // this.stockMockData()
  }

  loadForex(): void {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + sessionStorage.getItem('jwt'),
    });
    this.http
      this.http.get<Forex[]>(environment.marketService + '/market/listing/get/forex', {headers})
      .subscribe(
        (res) =>
          (this.forexBackup = this.forex =
            res.map((val) => {
              val.lastRefresh *= 1000;
              return val;
            }))
      );
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
    this.selectedTab = tab;
  }

  navigateToFuture(listingId: any) {
    this._router.navigateByUrl(`/security/future/${listingId}`);
  }

  navigateToForex(forexId: number): void {
    this._router.navigateByUrl(`/security/forex/${forexId}`);
  }

  navigateToStock(stockId: number): void {
    this._router.navigateByUrl(`/security/stock/${stockId}`);
  }

  async buyOption(options: OptionsDto){
    let response = await this.orderService.buyOrder(OrderType.BUY, options.listingId.toString(), ListingType.OPTIONS, options.volume, 0, 0, false);
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


}
