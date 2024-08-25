import { Component } from '@angular/core';
import { ReusableDatatableComponent } from '../../shared/reusable-datatable/reusable-datatable.component';
import { Observable } from 'rxjs';
import { Pricing } from '../../../models/pricing/pricing';
import { PricingService } from '../../../services/pricing.service';
import { DatePipe } from '@angular/common';
import { DeleteCommand } from '../../shared/reusable-datatable/DeleteCommand';

@Component({
  selector: 'app-pricing-table',
  standalone: true,
  imports: [ReusableDatatableComponent],
  templateUrl: './pricing-table.component.html',
  styleUrl: './pricing-table.component.scss'
})
export class PricingTableComponent implements DeleteCommand {

  observable: Observable<any[]> = new Observable<any[]>();
  columns = [
    {
      columnDef: 'id',
      header: 'ID',
      cell: (element: Pricing) => `${element.id}`,
    },
    {
      columnDef: 'price',
      header: 'Price',
      cell: (element: Pricing) => `${element.price}`,
    },
    {
      columnDef: 'effectiveDate',
      header: 'Date effective',
      cell: (element: Pricing) => `${this.convertDate(element.effectiveDate)}`,
    },
    {
      columnDef: 'expirationDate',
      header: 'Date expiration',
      cell: (element: Pricing) => `${this.convertDate(element.expirationDate)}`,
    },
    {
      columnDef: 'description',
      header: 'Description',
      cell: (element: Pricing) => `${element.description}`,
    },
  ];

  datePipe: DatePipe;

  constructor(private pricingService: PricingService) {
    this.observable = pricingService.getPricings();
    this.datePipe = new DatePipe('en-US');
  }

  convertDate(date: Date): String {
    const dateParts = date.toString().split(',').map(part => parseInt(part, 10));
    const newDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3], dateParts[4]);
    return this.datePipe.transform(newDate, 'dd MMMM yyyy') || '';
  }

  disableItems(id_list: Number[]): Observable<boolean> {
    return this.pricingService.disablePricings(id_list);
  }
}
