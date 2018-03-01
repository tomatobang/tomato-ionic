import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Cacheable } from 'rebirth-storage';
import {
  RebirthHttp,
  RebirthHttpProvider,
  GET,
  POST,
  DELETE,
  Query,
  Path,
  Body
} from 'rebirth-http';
import { baseUrl } from '../../../config';

import { TomatoService } from './abstract/tomato.abstract';
import { Tomato } from './model/tomato.model';
import { SearchResult } from './model/search-result.model';


@Injectable()
export class OnlineTomatoService extends TomatoService {
  constructor(
    protected http: HttpClient,
    protected rebirthHttpProvider: RebirthHttpProvider
  ) {
    super(http);
  }

  @POST(baseUrl + 'api/tomato')
  CreateTomato(@Body tomato: Tomato): Observable<any> {
    return null;
  }

  // @Cacheable({ pool: 'tomatos' })
  @GET(baseUrl + 'api/tomato')
  getTomatos(
    @Query('pageIndex') pageIndex = 1,
    @Query('pageSize') pageSize = 10,
    @Query('keyword') keyword?: string
  ): Observable<Array<Tomato>> {
    return null;
  }

  @POST(baseUrl + 'api/search')
  searchTomatos(@Body
  keywords: {
    keywords;
    pageSize?: 10;
    pageIndex?: 1;
  }): Observable<Array<Tomato>> {
    return null;
  }

  // @Cacheable({ pool: 'tomatos' })
  @GET(baseUrl + 'filter/tomatotoday')
  getTodayTomatos(): Observable<Array<Tomato>> {
    return null;
  }

  @GET(baseUrl + 'api/tomato/:id')
  getTomatoByTitle(@Path('id') tomatoTitle: string): Observable<Tomato> {
    return null;
  }

  @POST(baseUrl + 'api/tomato/:id')
  updateTomato(
    @Path('id') tomatoUrl: string,
    @Body tomato: Tomato
  ): Observable<any> {
    return null;
  }

  @DELETE(baseUrl + 'api/tomato/:id')
  deleteTomato(@Path('id') tomatoUrl: string): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'api/tomato/statistics')
  statistics(@Body isSuccess: { isSuccess; date }): Observable<any> {
    return null;
  }
}

export const TOMATO_SERVICE_PROVIDERS: Array<any> = [
  {
    provide: TomatoService,
    // environment.deploy === 'github' ? GithubTomatoService : OnlineTomatoService
    useClass: OnlineTomatoService
  }
];
