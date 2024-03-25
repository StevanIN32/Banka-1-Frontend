import { Component } from '@angular/core';
import { Security, SecurityService } from '../service/security.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {ForexTableComponent} from "../forex-table/forex-table.component";
import {StockListing, StockService} from "../service/stock.service";
import {FormsModule} from "@angular/forms";
import {StockTableComponent} from "./components/stock-table/stock-table.component";
import {FutureTableComponent} from "./components/future-table/future-table.component";

@Component({
  selector: 'app-security-list',
  standalone: true,
  imports: [CommonModule, FormsModule, StockTableComponent, ForexTableComponent, FutureTableComponent],
  templateUrl: './security-list.component.html',
  styleUrl: './security-list.component.css'
})
export class SecurityListComponent {
  users: Security[] = [];
  selectedTab: string = "stocks";

  constructor(private securityService: SecurityService,
              private stockService: StockService) {

  }

  async ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.securityService.getUsers().subscribe(
      (users: Security[]) => {
        this.users = users;
      },
      (error: HttpErrorResponse) => {
        console.error('Error loading users:', error);
      }
    );
  }

  setSelectedTab(tab: string) {
    console.log(tab)
    this.selectedTab = tab;
  }
}
