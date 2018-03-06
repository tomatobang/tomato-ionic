import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { baseUrl } from '../config';
import { GlobalService } from './global.service';

declare var window;

@Injectable()
export class QiniuUploadService {
  constructor(public http: HttpClient, public _g: GlobalService) {}

  public getUploadToken(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this._g.token,
      }),
    };

    return this.http
      .get(baseUrl + 'qiu/uploadtoken', httpOptions)
      .map((res: HttpResponse<any>) => {
        return res;
      })
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public init(uploadToken) {
    window.plugins.QiNiuUploadPlugin.init(
      uploadToken,
      data => {
        console.log('qiniu,init ret suncceed:', data);
        // debugger;
      },
      err => {
        console.log('qiniu,init ret err:', err);
        // debugger;
      }
    );
  }

  public uploadLocFile(filePath, name) {
    return Observable.create(observer => {
      window.plugins.QiNiuUploadPlugin.simpleUploadFile(
        {
          filePath: filePath,
          name: name,
        },
        data => {
          console.log('qiniu,uploadLocFile ret succeed:', data);
          observer.next({
            data: true,
            value: data,
          });
          observer.complete();
          // debugger;
        },
        progress => {
          // console.log('qiniu,uploadLocFile ret progress:', progress);
          observer.next({
            data: false,
            value: progress,
          });
          // debugger;
        },
        err => {
          console.log('qiniu,uploadLocFile ret err:', err);
          observer.error(err);
          // debugger;
        }
      );
    });
  }

}
