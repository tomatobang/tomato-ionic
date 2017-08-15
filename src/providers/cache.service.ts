/**
 * 内存变量
 */

import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CacheService {

    /**
     * [构造函数]
     */
    constructor(public global: GlobalService) {
    }

    private _clone(object: any) {
        if (object) {
            return JSON.parse(JSON.stringify(object));
        } else {
            return null;
        }
    }

}
