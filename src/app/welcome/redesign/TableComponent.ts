import {ContentChild, EventEmitter, NgModule, Output, TemplateRef} from '@angular/core';
import {CommonModule} from "@angular/common";
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dynamic-table',
  template: `
    <table>
      <thead>
      <tr>
        <th *ngFor="let header of headersArray">{{ header }}</th>
        <th *ngIf="showActions">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let row of dataArray; let i = index">
        <td *ngFor="let key of objectKeys(row)">
          {{ row[key] }}
        </td>
        <td *ngIf="showActions">
          <ng-container *ngTemplateOutlet="customTemplate; context: {$implicit: row, index: i}"></ng-container>
        </td>
      </tr>
      </tbody>
    </table>
  `,
  styles: [`
    table {
      width: 40vw;
      border-collapse: collapse;
      font-family: 'Jura', sans-serif;
      font-size: 1.1em;
      color: var(--banka-white);
      margin: 20px 0;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    th {
      background-color: var(--banka-very-dark-gray); /* Dark grayish-blue for the header */
      color: var(--banka-white);
      padding: 20px 15px;
    }

    td {
      padding: 12px 15px;
      background-color: var(--banka-dark-gray); /* Light beige for table cells */
      border-bottom: 1px solid var(--banka-white); /* Horizontal line color */
    }

    tbody tr:hover td {
      background-color: var(--banka-very-dark-gray); /* Light brown for row hover */
    }
  `]
})
export class TableComponent {
  @Input() headersArray: string[] = [];
  @Input() dataArray: any[] = [];
  @Input() showActions: boolean = false;
  @Output() customButtonClick = new EventEmitter<{ row: any, index: number }>();

  @ContentChild(TemplateRef) customTemplate!: TemplateRef<any>;

  // Helper function to get keys from the row object
  objectKeys = Object.keys;
}
@NgModule({
  declarations: [TableComponent],
  imports: [CommonModule],
  exports: [TableComponent],
})
export class TableComponentModule {}
