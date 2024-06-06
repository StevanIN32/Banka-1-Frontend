import { Pipe, PipeTransform } from '@angular/core';
import { Security } from './service/security.service';
import { StockListing } from './model/model';

@Pipe({
  name: 'transformSecurity',
  standalone: true,
})
export class TransformSecurityPipe implements PipeTransform {
  transform(securities: StockListing[]): any[] {
    return securities.map((sec: StockListing) => {
      return {
        ticker: sec.ticker,
        name: sec.name,
        lastRefresh: new Date(sec.lastRefresh).toLocaleString(),
        price: sec.price,
        high: sec.high,
        low: sec.low,
        priceChange: sec.priceChange,
        volume: sec.volume,
        outstandingShares: sec.outstandingShares,
        exchangeName: sec.exchangeName,
        dividendYield: sec.dividendYield,
        originalStock: sec
      };
    });
  }
}
