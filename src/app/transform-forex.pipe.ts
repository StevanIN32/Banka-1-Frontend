import { Pipe, PipeTransform } from '@angular/core';
import { Forex } from './model/model';

@Pipe({
  name: 'transformForex',
  standalone: true,
})
export class TransformForexPipe implements PipeTransform {
  transform(forexs: Forex[]): any[] {
    return forexs.map((forex) => {
      return {
        quoteCurrency: forex.quoteCurrency,
        baseCurrency: forex.baseCurrency,
        price: forex.price,
        exchangeName: forex.exchangeName,

        // ticker: forex.ticker,
        // name: forex.name,
        // lastRefresh: new Date(forex.lastRefresh).toLocaleString(),
        // high: forex.high,
        // low: forex.low,
        // priceChange: forex.priceChange,
        // volume: forex.volume,
        originalForex: forex,
      };
    });
  }
}
