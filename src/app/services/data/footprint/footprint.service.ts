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

import { FootprintService } from './abstract/footprint.abstract';
import { Footprint } from './model/footprint.model';

@Injectable()
export class OnlineFootprintService extends FootprintService {
  constructor(
    protected http: HttpClient,
    protected rebirthHttpProvider: RebirthHttpProvider
  ) {
    super(http);
  }

  @POST(baseUrl + 'api/footprint/')
  createFootprint(@Body footprint: Footprint): Observable<any> {
    return null;
  }

  @GET(baseUrl + 'api/footprint')
  getFootprints(
    @Query('pageIndex') pageIndex = 1,
    @Query('pageSize') pageSize = 10,
    @Query('keyword') keyword?: string
  ): Observable<Array<Footprint>> {
    return null;
  }

  @GET(baseUrl + 'api/footprint/:id')
  getFootprintByTitle(@Path('id') footprintTitle: string): Observable<Footprint> {
    return null;
  }

  @POST(baseUrl + 'api/footprint/:id')
  updateFootprint(@Path('id') id: string, @Body footprint: Footprint): Observable<any> {
    return null;
  }

  @DELETE(baseUrl + 'api/footprint/:id')
  deleteFootprint(@Path('id') id: string): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'api/footprint/toggleall')
  toggelAllFootprint(@Body data): Observable<any> {
    return null;
  }
  @POST(baseUrl + 'api/footprint/deletecomplete')
  deleteAllCompletedFootprint(): Observable<any> {
    return null;
  }
}

export const FOOTPRINT_SERVICE_PROVIDERS: Array<any> = [
  {
    provide: FootprintService,
    useClass: OnlineFootprintService,
  },
];
