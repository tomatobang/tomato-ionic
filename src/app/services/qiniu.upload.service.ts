import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import { baseUrl } from '../config';
import { GlobalService } from './global.service';

declare var window;

@Injectable({
  providedIn: 'root',
})
export class QiniuUploadService {
  private _qiuniutoken_updatetime: any;

  constructor(public http: HttpClient, public _g: GlobalService) { }

  public getUploadToken(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this._g.token,
      }),
    };

    return this.http.get(baseUrl + 'qiu/uploadtoken', httpOptions).pipe(
      map((res: HttpResponse<any>) => {
        return res;
      })
    );
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
        }
      );
    });
  }

  /**
   * 上传本地文件
   * @param filePath 路径
   * @param name 名称
   * @param isTryAgain 是否为重试操作
   */
  public uploadLocFile(filePath, name) {
    return Observable.create(observer => {
      this.simpleUploadFile(filePath, name).subscribe(ret => {
        observer.next(ret);
        if (ret && ret.data) {
          observer.complete();
        }
      }, err => {
        if (err && err.info.indexOf("expired") !== -1) {
          // refresh token and try again
          this.initQiniu(true).subscribe(() => {
            return this.simpleUploadFile(filePath, name).subscribe((data) => {
              observer.next(data);
              if (data && data.data) {
                observer.complete();
              }
            });
          });

        } else {
          observer.error(err);
        }
      });
    });
  }

  simpleUploadFile(filePath, name): Observable<any> {
    return Observable.create(observer => {
      window.plugins.QiNiuUploadPlugin.simpleUploadFile(
        {
          filePath: filePath,
          name: name,
        },
        data => {
          console.log('qiniu uploadLocFile succeed:', data);
          observer.next({
            data: true,
            value: data,
          });
          observer.complete();
        },
        progress => {
          observer.next({
            data: false,
            value: progress.percent,
          });
        },
        err => {
          observer.error(err);
        }
      );
    });
  }

  /**
   * 七牛初始化
   * @param force 是否强制刷新
   */
  initQiniu(force?): Observable<any> {
    return Observable.create(observer => {
      if (this._qiuniutoken_updatetime && !force) {
        const timespan = new Date().getTime() - this._qiuniutoken_updatetime.getTime();
        const timespan_milliseconds = timespan % (3600 * 1000);
        const timespan_minutes = Math.floor(
          timespan_milliseconds / (60 * 1000)
        );
        if (timespan_minutes < 90) {
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
        this._qiuniutoken_updatetime = new Date();
        this.init(data.uploadToken).subscribe(d => {
          observer.next(true);
        });
      },
      err => {
        console.log('qiniu init error:', err);
        observer.error(false);
      }
    );
  }
}
