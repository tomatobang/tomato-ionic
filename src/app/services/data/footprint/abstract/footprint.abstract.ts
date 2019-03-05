import { Observable } from 'rxjs';
import { RebirthHttp } from 'rebirth-http';

import { Footprint } from '../model/footprint.model';

export abstract class FootprintService extends RebirthHttp {
  abstract createFootprint(footprint: Footprint): Observable<any>;

  abstract getFootprints(
    pageIndex: any,
    pageSize: any,
    keyword?: string
  ): Observable<Array<Footprint>>;

  abstract updateFootprint(footprintUrl: string, footprint: Footprint): Observable<any>;

  abstract deleteFootprint(footprintUrl: string): Observable<any>;
}
