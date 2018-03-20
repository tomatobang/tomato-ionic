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
  private _qiuniutokeninfo: any;

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

  public init(uploadToken): Observable<any> {
    return Observable.create(observer => {
      window.plugins.QiNiuUploadPlugin.init(
        uploadToken,
        data => {
          console.log('qiniu,init ret suncceed:', data);
          observer.next(data);
          observer.complete();
        },
        err => {
          console.log('qiniu,init ret err:', err);
          observer.error(err);
          // debugger;
        }
      );
    });
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

  initQiniu(): Observable<any> {
    return Observable.create(observer => {
      if (this._qiuniutokeninfo) {
        const timespan = new Date().getTime() - this._qiuniutokeninfo.getTime();
        const timespan_milliseconds = timespan % (3600 * 1000);
        const timespan_minutes = Math.floor(timespan_milliseconds / (60 * 1000));
        if (timespan_minutes < 115) {
          observer.next(true);
        } else {
          this.getQiniuTokenAndInit(observer);
        }
      } else {
        this.getQiniuTokenAndInit(observer);
      }
    });
  }

  getQiniuTokenAndInit(observer) {
    this.getUploadToken().subscribe(
      data => {
        console.log('qiniutoken:', data);
        const qiuniutokeninfo = {
          qiniutoken: data.uploadToken,
          dateTime: new Date().getTime(),
        };
        this._qiuniutokeninfo = data.uploadToken;
        this.init(data.uploadToken).subscribe(d => {
          observer.next(true);
        });
      },
      err => {
        observer.error(false);
      }
    );
  }
}
