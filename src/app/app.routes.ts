import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { ListUserComponent } from './list-user/list-user.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { SecurityListComponent } from './security-list/security-list.component';
import { NgModule } from "@angular/core";
import { WelcomeComponent } from './welcome/welcome.component';
import {ForexViewComponent} from "./forex-view/forex-view.component";
import {StockViewComponent} from "./stock-view/stock-view.component";
import {loginGuard} from "./guards/login.guard";
import {welcomeGuard} from "./guards/welcome.guard";
import { ExchangeRateComponent } from './exchange-rate/exchange-rate.component';
import { TransactionComponent } from './transaction/transaction.component';
import { CustomerComponent } from './customer/customer.component';
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {UserResetPasswordComponent} from "./user-reset-password/user-reset-password.component";
import {UserDetailComponent} from "./user-detail/user-detail.component";
import {ActivateAccountComponent} from "./activate-account/activate-account.component";
import {FutureViewComponent} from "./future-view/future-view.component";
import {OrdersComponent} from "./orders/orders.component";
import {CardTransactionsComponent} from "./card-transactions/card-transactions.component";
import {LoanTableComponent} from "./loans/loan-table/loan-table.component";
import {NewLoanComponent} from "./loans/new-loan/new-loan.component";
import { NewPaymentComponent } from './new-payment/new-payment.component';
import { TransactionsOverviewComponent } from './transactions-overview/transactions-overview.component';
import { RecipientsComponent } from './recipients/recipients.component';
import { supportsPassiveEventListeners } from '@angular/cdk/platform';
import { BankAccountsAndCardsComponent } from "./bank-accounts-and-cards/bank-accounts-and-cards.component";
import { PositionsGuard } from './guards/positions.guard';
import { LegalPersonsComponent } from './legal-persons/legal-persons.component';
import { BankProfitComponent } from './bank-profit/bank-profit.component';
import { BankAccountAdminComponent } from './bank-account-admin/bank-account-admin.component';
import { TransactionDetailsAdminComponent } from './transaction-details-admin/transaction-details-admin.component';
import {OtcComponent} from "./otc/otc.component";
import {SecuritiesLegalPersonsComponent} from "./securities-legal-persons/securities-legal-persons.component";
import {LegalPersonGuard} from "./guards/legalperson.guard";
import {OrdersLegalPersonsComponent} from "./orders-legal-persons/orders-legal-persons.component";
import {OtcCustomerComponent} from "./otc-customer/otc-customer.component";
import {MarginComponent} from "./margin/margin.component";
import {MarginTransactionDetailsComponent} from "./margin-transaction-details/margin-transaction-details.component";
import {ExchangeTransactionReportComponent} from "./exchange-transaction-report/exchange-transaction-report.component";



export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, //this will make the first page that is loaded a login page
  { path: 'login', component: LoginPageComponent, canActivate: [loginGuard] },
  { path: 'welcome', component: WelcomeComponent, canActivate: [welcomeGuard] },
  {
    path: 'user',
    canActivate: [PositionsGuard],
    children: [
      { path: 'add', component: AddUserComponent },
      { path: 'update', component: UpdateUserComponent },
      { path: 'list', component: ListUserComponent },
    ],
    data: { roles: ['agent', 'supervizor', 'admin'] }
  },
  // {
  //   path: 'orders', component: OrdersComponent, canActivate: [LegalPersonGuard],
  //   data: { roles: ['agent', 'supervizor', 'admin'] }
  // },

  {
    path: 'orders',
    children: [
      { path: 'regular', component: OrdersComponent,
        canActivate: [PositionsGuard],
        data: { roles: ['agent', 'supervizor', 'admin', 'customer'] }},
      { path: 'legal', component: OrdersLegalPersonsComponent, canActivate: [LegalPersonGuard]},
    ]
  },


  { path: 'activate-account', component: ActivateAccountComponent },
  { path:'customer/set-password/:token', component: SetPasswordComponent},
  { path:'employee/set-password/:token', component: SetPasswordComponent},
  { path:'reset-password/:position', component: ResetPasswordComponent, canActivate: [loginGuard]},
  { path:'customer/reset-password/:token', component: UserResetPasswordComponent, canActivate: [loginGuard]},
  { path:'employee/reset-password/:token', component: UserResetPasswordComponent, canActivate: [loginGuard]},
  {
    path: 'security',
    children: [
      { path: 'all', component: SecurityListComponent },
      { path: "stock/:ticker", component: StockViewComponent },
      { path: 'forex/:ticker', component: ForexViewComponent},
      { path: 'future/:ticker', component: FutureViewComponent},
    ],
    canActivate: [PositionsGuard, ],
    data: { roles: ['agent', 'supervizor', 'admin', 'customer'] }
  },

  {
    path: 'security/legal', component: SecuritiesLegalPersonsComponent, canActivate: [LegalPersonGuard]
  },

  {
    path: 'securities',
    component: SecurityListComponent,
    canActivate: [PositionsGuard],
    data: { roles: ['agent', 'supervizor', 'admin'] }
  },


  {
    path:'exchange', component: TransactionComponent, canActivate: [PositionsGuard],
    data: { roles: ['customer'] }
  },
  {
    path:'payment', component: NewPaymentComponent, canActivate: [PositionsGuard],
    data: { roles: ['customer'] }
  },

  // {path:'exchange-rate', component: ExchangeRateComponent,canActivate:[ExchangeRateGuard]},

  {
    path: 'customer',
    children: [
      {path: 'all', component: CustomerComponent},
      {path: 'view', component: UserDetailComponent}
    ],
    canActivate: [PositionsGuard],
    data: { roles: ['admin'] } // Moci ce svi kad se aktivira prosirenje
  },
  {
    path: 'payment/overview',component: TransactionsOverviewComponent, canActivate: [PositionsGuard],
    data: { roles: ['customer'] }
  },
  {
    path: 'transaction', component: TransactionComponent, canActivate: [PositionsGuard],
    data: { roles: ['customer'] }
  },
  {
    path: 'exchange-rate', component: ExchangeRateComponent, canActivate: [PositionsGuard],
    data: { roles: ['customer'] }
  },
  {
    path: 'bank-accounts', component: BankAccountsAndCardsComponent, canActivate: [PositionsGuard],
    data: { roles: ['customer'], type: 'bankAccount' }
  },
  {
    path: 'bank-accounts-admin', component: BankAccountAdminComponent,canActivate: [PositionsGuard],
    data: { roles: ['admin']}
  },
  {
    path: 'transaction-details-admin/:accountNumber', component: TransactionDetailsAdminComponent,canActivate: [PositionsGuard],
    data: { roles: ['admin']}
  },
  {
    path: 'recipients', component: RecipientsComponent, canActivate: [PositionsGuard],
    data: { roles: ['customer'] }
  },
  {
    path: 'cards', component: BankAccountsAndCardsComponent,canActivate: [PositionsGuard],
    data: { roles: ['customer'], type: 'card' }
  },
  {
    path: 'loans', component: LoanTableComponent, canActivate: [PositionsGuard],
    data: { roles: ['customer'] }
  },
  {
    path: 'bank-profit', component: BankProfitComponent,canActivate: [PositionsGuard],
    data: { roles: ['admin']}
  },
  {
    path: 'new-loan', component: NewLoanComponent, canActivate: [PositionsGuard],
    data: { roles: ['customer'] }
  },
  {
    path: 'card-transactions', component: CardTransactionsComponent, canActivate: [PositionsGuard],
    data: { roles: ['customer'] }
  },
  {
    path: 'legal-persons', component: LegalPersonsComponent, canActivate: [PositionsGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'otc', component: OtcComponent, canActivate: [PositionsGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'otc-customer', component: OtcCustomerComponent, canActivate: [PositionsGuard],
    data: { roles: ['customer'] }
  },
  {
    path: 'margin', component: MarginComponent, canActivate: [PositionsGuard],
    data: { roles: ['agent', 'supervizor', 'admin'] }
  },
  {
    path: 'margin-transaction-details/:accountNumber', component: MarginTransactionDetailsComponent, canActivate: [PositionsGuard],
    data: { roles: ['agent', 'supervizor', 'admin'] }
  },
  {
    path: 'exchange-transaction-report', component: ExchangeTransactionReportComponent, canActivate: [PositionsGuard],
    data: { roles: ['agent', 'supervizor', 'admin'] }
  },




  // { path: 'customer/:customerId', component: UserDetailComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutes { }
