import { Observable } from 'rxjs';
import { RebirthHttp } from 'rebirth-http';

import { Tomato } from '../model/tomato.model';

export abstract class TomatoService extends RebirthHttp {
  abstract CreateTomato(tomato: Tomato): Observable<any>;

  abstract getTomatos(
    pageIndex: any,
    pageSize: any,
    keyword?: string
  ): Observable<Array<Tomato>>;

  abstract searchTomatos(
    pageIndex: any,
    pageSize: any,
    keywords?: string
  ): Observable<Array<Tomato>>;

  abstract getTodayTomatos(Authorization: string): Observable<Array<Tomato>>;

  abstract getTomatoByTitle(tomatoTitle: string): Observable<Tomato>;

  abstract updateTomato(tomatoUrl: string, tomato: Tomato): Observable<any>;

  abstract deleteTomato(tomatoUrl: string): Observable<any>;

  abstract statistics(isSuccess: { isSuccess; date }): Observable<any>;
}
