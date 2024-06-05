import { Component, ViewChild } from '@angular/core';
import { Forex, ListingHistory } from '../model/model';
import { ForexService } from '../service/forex.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { OrangeButtonModule } from '../welcome/redesign/OrangeButton';
import { PopupService } from '../service/popup.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forex-view',
  standalone: true,
  imports: [CommonModule,BaseChartDirective, OrangeButtonModule],
  templateUrl: './forex-view.component.html',
  styleUrl: './forex-view.component.css',
})
export class ForexViewComponent {
  forex: Forex | null = null;
  @ViewChild(BaseChartDirective)
  chart: BaseChartDirective | undefined;
  forexHistory: ListingHistory[] = [];
  forexId: number = 0;
  graphFilter: 'd' | 'm' | 'y' | '5y' | 'all' = 'd';
  router: Router;

  chartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Forex price history',
        fill: 'origin',
        backgroundColor: "#FFB72B"
      },
    ],
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
  };
  lineChartType: ChartType = 'line';
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

  constructor(
    private forexService: ForexService,
    private route: ActivatedRoute,
    private popupService: PopupService,
    router: Router
  ) {
    this.route.params.subscribe((params) => (this.forexId = params['ticker']));

    this.router = router;
  }

  refresh() {
    this.ngOnInit().then();
  }

  goBack() {
    this.router.navigateByUrl(`/securities`);
  }

  async ngOnInit() {
    this.forex = await this.forexService.getForexById(this.forexId);
    console.log(this.forex);
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

    this.forexHistory = await this.forexService.getForexHistory(
      this.forexId,
      graphFilterValue,
      null
    );
    this.generateChartData();
  }

  generateChartData() {
    this.chartData.datasets[0].data = [];
    for (let listingHistory of this.forexHistory) {
      this.chartData.datasets[0].data.push(listingHistory.price);
    }
    this.chart?.chart?.update();
  }

  openBuyPopup() {
    this.popupService.openBuyPopup(null, this.forex, null);
  }
}
