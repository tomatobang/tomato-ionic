import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { baseUrl } from '../config';
import { GlobalService } from './global.service';

declare var window;

@Injectable()
export class QiniuUploadService {
  constructor(public http: Http, public _g: GlobalService) {}

  public getUploadToken(): Observable<any> {
    const httpOptions = {
      headers: new Headers({
        Authorization: this._g.token,
      }),
    };

    return this.http
      .get(baseUrl + 'qiu/uploadtoken', httpOptions)
      .map((res: Response) => {
        return res;
      })
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public init(uploadToken) {
    window.plugins.QiNiuUploadPlugin.init(
      uploadToken,
      data => {
        console.log('qiniu,init ret suncceed:', data);
        debugger;
      },
      err => {
        console.log('qiniu,init ret err:', err);
        debugger;
      }
    );
  }

  public uploadHeadImg(filePath, name) {
    window.plugins.QiNiuUploadPlugin.simpleUploadFile(
      {
        filePath: filePath,
        name: name,
      },
      data => {
        console.log('qiniu,uploadHeadImg ret suncceed:', data);
        // debugger;
      },
      progress =>{
        console.log('qiniu,uploadHeadImg ret progress:', progress);
        // debugger;
      },
      err => {
        console.log('qiniu,uploadHeadImg ret err:', err);
        debugger;
      }
    );
  }

  public uploadVoiceFile() {}
}
