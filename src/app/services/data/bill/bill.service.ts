import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RebirthHttpProvider,
  GET,
  POST,
  DELETE,
  Query,
  Path,
  Body,
} from 'rebirth-http';
import { baseUrl } from '../../../config';

import { BillService } from './abstract/bill.abstract';
import { Bill } from './model/bill.model';

@Injectable({
  providedIn: 'root',
})
export class OnlineBillService extends BillService {
  constructor(
    protected http: HttpClient,
    protected rebirthHttpProvider: RebirthHttpProvider
  ) {
    super(http);
  }

  @POST(baseUrl + 'api/bill/')
  createBill(@Body bill: Bill): Observable<any> {
    return null;
  }

  @GET(baseUrl + 'api/bill')
  getBills(
    @Query('date') date = new Date(),
    @Query('pageIndex') pageIndex = 1,
    @Query('pageSize') pageSize = 10,
    @Query('keyword') keyword?: string
  ): Observable<Array<Bill>> {
    return null;
  }

  @GET(baseUrl + 'api/bill/:id')
  getBillByTitle(@Path('id') billTitle: string): Observable<Bill> {
    return null;
  }

  @POST(baseUrl + 'api/bill/:id')
  updateBill(@Path('id') id: string, @Body bill: Bill): Observable<any> {
    return null;
  }

  @DELETE(baseUrl + 'api/bill/:id')
  deleteBill(@Path('id') id: string): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'api/bill/statistics')
  statistics(@Body data: { date }): Observable<any> {
    return null;
  }
}

export const BILL_SERVICE_PROVIDERS: Array<any> = [
  {
    provide: BillService,
    useClass: OnlineBillService,
  },
];
