import { Observable } from 'rxjs';
import { RebirthHttp } from 'rebirth-http';

import { Bill } from '../model/bill.model';

export abstract class BillService extends RebirthHttp {
  abstract createBill(bill: Bill): Observable<any>;

  abstract getBills(
    date: any,
    pageIndex: any,
    pageSize: any,
    keyword?: string
  ): Observable<Array<Bill>>;

  abstract updateBill(billUrl: string, bill: Bill): Observable<any>;

  abstract deleteBill(billUrl: string): Observable<any>;

  abstract statistics(data: { date }): Observable<any>;
}
