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

import { TagService } from './abstract/tag.abstract';
import { Tag } from './model/tag.model';

@Injectable({
  providedIn: 'root',
})
export class OnlineTagService extends TagService {
  constructor(
    protected http: HttpClient,
    protected rebirthHttpProvider: RebirthHttpProvider
  ) {
    super(http);
  }

  @POST(baseUrl + 'api/tag/')
  createTag(@Body tag: Tag): Observable<any> {
    return null;
  }

  @GET(baseUrl + 'api/tag')
  getTags(
    @Query('type') type?: number,
    @Query('pageIndex') pageIndex?: number,
    @Query('pageSize') pageSize?: number,
    @Query('keyword') keyword?: string
  ): Observable<Array<Tag>> {
    return null;
  }

  @GET(baseUrl + 'api/tag/:id')
  getTagByTitle(@Path('id') tagTitle: string): Observable<Tag> {
    return null;
  }

  @POST(baseUrl + 'api/tag/:id')
  updateTag(@Path('id') id: string, @Body tag: Tag): Observable<any> {
    return null;
  }

  @DELETE(baseUrl + 'api/tag/:id')
  deleteTag(@Path('id') id: string): Observable<any> {
    return null;
  }
}

export const TAG_SERVICE_PROVIDERS: Array<any> = [
  {
    provide: TagService,
    useClass: OnlineTagService,
  },
];
