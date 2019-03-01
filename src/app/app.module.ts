
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { ErrorHandler, NgModule,Injectable } from '@angular/core';

@Injectable()
export class IonicGestureConfig extends HammerGestureConfig {
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

import { SocketIoModule } from 'ngx-socket-io';
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
    SocketIoModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  bootstrap: [MyApp],
  entryComponents: [MyApp],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // { provide: ErrorHandler, useClass: MyErrorHandler },
    // { provide: ErrorHandler, useClass: RavenErrorHandler }
  ],
})
export class AppModule { }
