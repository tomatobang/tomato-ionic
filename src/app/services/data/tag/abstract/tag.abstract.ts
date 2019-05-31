import { Observable } from 'rxjs';
import { RebirthHttp } from 'rebirth-http';

import { Tag } from '../model/tag.model';

export abstract class TagService extends RebirthHttp {
  abstract createTag(tag: Tag): Observable<any>;

  abstract getTags(
    type?: number,
    pageIndex?: number,
    pageSize?: number,
    keyword?: string
  ): Observable<Array<Tag>>;

  abstract updateTag(tagUrl: string, tag: Tag): Observable<any>;

  abstract deleteTag(tagUrl: string): Observable<any>;
}
