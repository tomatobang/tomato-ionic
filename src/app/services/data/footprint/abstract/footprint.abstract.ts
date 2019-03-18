import { Observable } from 'rxjs';
import { RebirthHttp } from 'rebirth-http';

import { Footprint } from '../model/footprint.model';

export abstract class FootprintService extends RebirthHttp {
  abstract createFootprint(footprint: Footprint): Observable<any>;

  abstract getFootprints(
    date:any,
    pageIndex: any,
    pageSize: any,
    keyword?: string
  ): Observable<Array<Footprint>>;

  abstract updateFootprint(footprintUrl: string, footprint: Footprint): Observable<any>;
  abstract deleteFootprint(footprintUrl: string): Observable<any>;
  abstract statistics(data: { date }): Observable<any>;
}
