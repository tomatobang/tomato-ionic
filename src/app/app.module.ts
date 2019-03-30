
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { ErrorHandler, NgModule, Injectable, LOCALE_ID } from '@angular/core';
import * as Hammer from 'hammerjs';
@Injectable()
export class IonicGestureConfig extends HammerGestureConfig {
  overrides = <any>{
    'swipe': { direction: Hammer.DIRECTION_ALL }
  };
  buildHammer(element: HTMLElement) {
    const mc = new (<any>window).Hammer(element);
    for (const eventName of Object.keys(this.overrides)) {
      mc.get(eventName).set(this.overrides[eventName]);
    }
    return mc;
  }
}

import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/Storage';
import { ServiceWorkerModule } from '@angular/service-worker';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { environment } from '../environments/environment';
import { QRScannerModalModule } from './modals/qr-scanner/qr-scanner.module';
import { QRImgModalModule } from './modals/qr-img/qr-img.module';

import { MyApp } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { MyErrorHandler } from './error.handler';
import { RavenErrorHandler } from './raven-error-handler.';

@NgModule({
  declarations: [MyApp],
  imports: [
    AppRoutingModule,
    CoreModule,
    SharedModule,
    BrowserModule,
    QRScannerModalModule,
    QRImgModalModule,
    IonicStorageModule.forRoot({
      name: '__tomatobangdb',
      driverOrder: ['indexeddb', 'sqlite', 'websql'],
    }),
    IonicModule.forRoot(),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  bootstrap: [MyApp],
  entryComponents: [MyApp],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'zh-CN' },
    // { provide: ErrorHandler, useClass: MyErrorHandler },
    // { provide: ErrorHandler, useClass: RavenErrorHandler }
  ],
})
export class AppModule { }
