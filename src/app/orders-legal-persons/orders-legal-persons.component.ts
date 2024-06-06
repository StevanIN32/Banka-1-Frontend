import { Component } from '@angular/core';
import {DatePipe, DecimalPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FilterByStatusPipeModule} from "../orders/FilterByStatusPipe";
import {FormsModule} from "@angular/forms";
import {OrangeButtonModule} from "../welcome/redesign/OrangeButton";
import {TableComponentModule} from "../welcome/redesign/TableComponent";
import {TransformPublicSecuritiesPipeModule} from "../orders/TransformPublicSecuritiesPipe";
import {TransformSecuritiesPipeModule} from "../orders/TransformSecuritiesPipe";
import {
  CapitalProfitDto,
  ListingType,
  OrderDto,
  PublicCapitalDto, PublicOffer, PublicStock,
  SellingRequest,
  StatusRequest, StockListing
} from "../model/model";
import {z} from "zod";
import {OrderService} from "../service/order.service";
import {PopupService} from "../service/popup.service";
import {WhiteTextFieldModule} from "../welcome/redesign/WhiteTextField";
import {ExtendedModule} from "@angular/flex-layout";

@Component({
  selector: 'app-orders-legal-persons',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    OrangeButtonModule,
    WhiteTextFieldModule,
    DecimalPipe,
    TableComponentModule,
    TransformSecuritiesPipeModule,
    TransformPublicSecuritiesPipeModule,
    DatePipe,
    FilterByStatusPipeModule,
    NgClass,
    ExtendedModule
  ],
  templateUrl: './orders-legal-persons.component.html',
  styleUrl: './orders-legal-persons.component.css'
})
export class OrdersLegalPersonsComponent {
  selectedTab: "public-securities" | "all-securities";
  isAdmin: boolean = sessionStorage.getItem('role') === "admin";
  isEmployee: boolean = sessionStorage.getItem('role') === "employee";
  isAgent = sessionStorage.getItem('role') === 'agent';
  isSupervizor = sessionStorage.getItem('role') === 'supervizor';

  amount: number = 0;
  limitValue: number = 0;
  stopValue: number = 0;
  allOrNone: boolean = false;
  margin: boolean = false;

  totalAvailableBalance: number = 0; // Global variable to store the sum
  orderLimitBalance: number = 0;

  securities: CapitalProfitDto[] = [];

  headersPublicSecurities = ['Security', 'Symbol', 'Amount', 'Price', 'Last Modified', 'Owner'];
  publicSecurities: PublicStock[] = [];

  allSecurities: any[] = [];
  changedPublicValue: number = -1;



  constructor(private orderService: OrderService,
              private popupService: PopupService) {
    // this.isLegalPerson = sessionStorage.getItem('isLegalPerson') === 'true';

    // if(this.isLegalPerson){
      this.selectedTab = "all-securities";
    // } else {
    //   this.selectedTab = "order-history";
    // }

  }



  private getSecurityOrders() {
    this.orderService.getSecurityOrders().subscribe({
      next: (securities: CapitalProfitDto[]) => {
        this.securities = securities;
        this.allSecurities = securities.map(security => ({
          security: security,
          showPopup: false
        }))
      },
      error: (error) => {
        console.error('Error fetching securities', error);
      }
    });

    // this.mockSecurityOrders();
  }



  getPublicSecurities(){
    let publicStocks: PublicCapitalDto[] = []
    this.orderService.getPublicStocks().subscribe( res =>{
      publicStocks = res;
    })

    let allStocks: StockListing[] = []
    this.orderService.getAllStocks().subscribe(res =>{
      allStocks = res;
    })

    const publicIds = publicStocks.map(stock => stock.listingId);
    const filterAllStocks = allStocks.filter(stock => publicIds.includes(stock.listingId))
    this.publicSecurities = filterAllStocks.map(stock => {
      const date = new Date(stock.lastRefresh);
      const formattedDate = new Intl.DateTimeFormat("en", {month: "long", year: "2-digit", day: "numeric"}).format(date);

      let publicStock: PublicStock = {
          listingType: stock.listingType,
          listingId: stock.listingId,
          ticker: stock.ticker,
          amount: stock.volume,
          price: stock.price,
          lastModified: formattedDate,
          bankAccount: this.getOwner(publicStocks, stock.listingId),
        }
        return publicStock;
    })


   // this.mockPublicSecurities()
  }

  getOwner(stocks: PublicCapitalDto[], listingId: number){
    const stock = stocks.find(stock => stock.listingId == listingId);
    if(stock != null)
      return stock.bankAccountNumber
    return "";
  }


  setSelectedTab(tab: "public-securities" | "all-securities") {
    this.selectedTab = tab;
  }

  async ngOnInit() {
    this.getSecurityOrders();
    this.getPublicSecurities();
  }



  sellOrder(original: any) {
    if(original.security.listingType === 'STOCK') {
      this.popupService.openSellPopup(original.security.listingId, false, false, true).afterClosed().subscribe(() =>{
        this.getSecurityOrders()
      });
    } else if(original.security.listingType === 'FOREX') {
      this.popupService.openSellPopup(original.security.listingId, false, true, false).afterClosed().subscribe(() =>{
        this.getSecurityOrders()
      });
    } else if(original.security.listingType === 'FUTURE') {
      this.popupService.openSellPopup(original.security.listingId, true, false, false).afterClosed().subscribe(() =>{
        this.getSecurityOrders()
      });
    }
  }

  changePublicValue(element: any){
    this.orderService.changePublicValue(element.listingType, element.listingId, this.changedPublicValue).subscribe(res => {
      if(res)
        this.getSecurityOrders();
    })
    element.showPopup = false;
  }

  showPopup(security: any){
    this.allSecurities.forEach(el => el.showPopup = false); // Close other popups
    this.changedPublicValue = security.public;
    security.showPopup = true;
  }

  changePublicValueButton(security: any): boolean{
    if (this.changedPublicValue > 0) {
      if (security.security.total > this.changedPublicValue)
        return true;
    }
    return false;
  }

  cancelChangePublic(security: any){
    security.showPopup = false;
    this.changedPublicValue = -1;
  }

  offerSecurity(security: PublicStock){
    this.popupService.openPublicSecuritiesPopup(security);
  }


  mockPublicSecurities(){
    const ex1 : PublicStock = {
      listingType: ListingType.STOCK,
      listingId: 456,
      ticker:"AAPL",
      amount: 138,
      price: 3831,
      lastModified:"Jan 1, 2024",
      bankAccount: "345677885",
    }

    this.publicSecurities.push(ex1);
  }

  mockSecurityOrders(){
    const example1: CapitalProfitDto = {
      bankAccountNumber: "string",
      listingType: ListingType.FOREX,
      listingId: 13425,
      totalPrice: 10000,
      total: 346457,
      ticker: "string",
      reserved: 35556,
      publicTotal: 123,
      averageBuyingPrice: 123
    }
    const example2: CapitalProfitDto = {
      bankAccountNumber: "string",
      listingType: ListingType.FOREX,
      listingId: 13425,
      totalPrice: 10000,
      total: 346457,
      ticker: "string",
      reserved: 35556,
      publicTotal: 123,
      averageBuyingPrice: 123
    }
    const example3: CapitalProfitDto = {
      bankAccountNumber: "string",
      listingType: ListingType.FOREX,
      listingId: 13425,
      totalPrice: 10000,
      total: 346457,
      ticker: "AAPL",
      reserved: 35556,
      publicTotal: 123,
      averageBuyingPrice: 123
    }

    this.securities.push(example1)
    this.securities.push(example2)
    this.securities.push(example3)

    this.allSecurities = this.securities.map(security => ({
      security: security,
      showPopup: false
    }))
  }
}
