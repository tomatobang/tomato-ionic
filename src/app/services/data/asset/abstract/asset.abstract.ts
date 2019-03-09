import { Observable } from 'rxjs';
import { RebirthHttp } from 'rebirth-http';

import { Asset } from '../model/asset.model';

export abstract class AssetService extends RebirthHttp {
  abstract createAsset(asset: Asset): Observable<any>;

  abstract getAssets(
    pageIndex: any,
    pageSize: any,
    keyword?: string
  ): Observable<Array<Asset>>;

  abstract updateAsset(assetUrl: string, asset: Asset): Observable<any>;

  abstract deleteAsset(assetUrl: string): Observable<any>;
}
