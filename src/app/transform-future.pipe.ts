import { Pipe, PipeTransform } from '@angular/core';
import { Future } from './model/model';

@Pipe({
  name: 'transformFuture',
  standalone: true,
})
export class TransformFuturePipe implements PipeTransform {
  transform(futures: Future[]): any {
    return futures.map((fut: Future) => {
      const date = new Date(fut.settlementDate);
      const formattedDate = new Intl.DateTimeFormat("en", {month: "long", year: "2-digit", day: "numeric"}).format(date);
      return {
        ticker: fut.ticker,
        name: fut.name,
        exchangeName: fut.exchangeName,
        lastRefresh: new Date(fut.lastRefresh).toLocaleString(),
        price: fut.price,
        high: fut.high,
        low: fut.low,
        priceChange: fut.priceChange.toFixed(2),
        volume: fut.volume,
        settlementDate: formattedDate,
        original: fut,
      };
    });
  }
}
