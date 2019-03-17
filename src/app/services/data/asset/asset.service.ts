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

import { AssetService } from './abstract/asset.abstract';
import { Asset } from './model/asset.model';

@Injectable()
export class OnlineAssetService extends AssetService {
  constructor(
    protected http: HttpClient,
    protected rebirthHttpProvider: RebirthHttpProvider
  ) {
    super(http);
  }

  @POST(baseUrl + 'api/asset/')
  createAsset(@Body asset: Asset): Observable<any> {
    return null;
  }

  @GET(baseUrl + 'api/asset')
  getAssets(
    @Query('pageIndex') pageIndex = 1,
    @Query('pageSize') pageSize = 10,
    @Query('keyword') keyword?: string
  ): Observable<Array<Asset>> {
    return null;
  }

  @GET(baseUrl + 'api/asset/:id')
  getAssetByTitle(@Path('id') assetTitle: string): Observable<Asset> {
    return null;
  }

  @POST(baseUrl + 'api/asset/:id')
  updateAsset(@Path('id') id: string, @Body asset: Asset): Observable<any> {
    return null;
  }

  @DELETE(baseUrl + 'api/asset/:id')
  deleteAsset(@Path('id') id: string): Observable<any> {
    return null;
  }
}

export const ASSET_SERVICE_PROVIDERS: Array<any> = [
  {
    provide: AssetService,
    useClass: OnlineAssetService,
  },
];
