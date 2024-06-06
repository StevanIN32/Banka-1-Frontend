import { Component, ViewChild } from '@angular/core';
import {
  ListingHistory,
  StockListing,
  StockService,
} from '../service/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';
import { PopupService } from '../service/popup.service';
import { OrangeButtonModule } from '../welcome/redesign/OrangeButton';

@Component({
  selector: 'app-stock-view',
  standalone: true,
  imports: [BaseChartDirective, CommonModule, OrangeButtonModule],
  templateUrl: './stock-view.component.html',
  styleUrl: './stock-view.component.css',
})
export class StockViewComponent {
  @ViewChild(BaseChartDirective)
  chart: BaseChartDirective | undefined;
  stockHistory: ListingHistory[] = [];
  stockId: number = 0;
  stock: StockListing | null = null;
  graphFilter: 'd' | 'm' | 'y' | '5y' | 'all' = 'd';
  router: Router;

  chartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Stock price history',
        fill: 'origin',
        backgroundColor: '#FFB72B',
      },
    ],
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
  };
  lineChartType: ChartType = 'line';
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute,
    private popupService: PopupService,
    router: Router
  ) {
    this.route.params.subscribe((params) => (this.stockId = params['ticker']));

    this.router = router;
  }



  goBack() {
    this.router.navigateByUrl(`/securities`);
  }

  refresh() {
    this.ngOnInit().then();
  }

  async ngOnInit() {
    this.stock = await this.stockService.getStockById(this.stockId);
    console.log(this.stock);
    await this.handleGraphFilter('d');
  }

  async handleGraphFilter(input: 'd' | 'm' | 'y' | '5y' | 'all') {
    this.graphFilter = input;
    let date = new Date();
    let graphFilterValue: number | null = null;
    switch (input) {
      case 'd':
        date.setDate(date.getDate() - 1);
        graphFilterValue = Math.floor(date.getTime() / 1000);
        this.chartData.labels = [
          '00:00',
          '04:00',
          '08:00',
          '12:00',
          '16:00',
          '20:00',
          '23:59',
        ];
        this.chart?.chart?.update();
        break;
      case 'm':
        date.setMonth(date.getMonth() - 1);
        graphFilterValue = Math.floor(date.getTime() / 1000);
        this.chartData.labels = ['1.', '5.', '10.', '15.', '20.', '25.', '30.'];
        this.chart?.chart?.update();
        break;
      case 'y':
        date.setFullYear(date.getFullYear() - 1);
        graphFilterValue = Math.floor(date.getTime() / 1000);
        this.chartData.labels = [
          'January',
          'March',
          'June',
          'September',
          'December',
        ];
        break;
      case '5y':
        date.setFullYear(date.getFullYear() - 5);
        graphFilterValue = Math.floor(date.getTime() / 1000);
        this.chartData.labels = [
          date.getFullYear(),
          date.getFullYear() + 1,
          date.getFullYear() + 2,
          date.getFullYear() + 3,
          date.getFullYear() + 4,
          date.getFullYear() + 5,
        ];
        break;
      case 'all':
        graphFilterValue = null;
        this.chartData.labels = [
          date.getFullYear() - 10,
          date.getFullYear() - 9,
          date.getFullYear() - 8,
          date.getFullYear() - 7,
          date.getFullYear() - 6,
          date.getFullYear() - 5,
          date.getFullYear() - 4,
          date.getFullYear() - 3,
          date.getFullYear() - 2,
          date.getFullYear() - 1,
          date.getFullYear(),
        ];
        break;
    }
    this.stockHistory = await this.stockService.getStockHistory(
      this.stockId,
      graphFilterValue,
      null
    );
    this.generateChartData();
  }

  generateChartData() {
    this.chartData.datasets[0].data = [];
    for (let stockHistory of this.stockHistory) {
      this.chartData.datasets[0].data.push(stockHistory.price);
    }
    this.chart?.chart?.update();
  }

  openBuyPopup() {
    this.popupService.openBuyPopup(null, null, this.stock);
  }
}
