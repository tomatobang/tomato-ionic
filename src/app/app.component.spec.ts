import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GlobalService } from '../providers/global.service';
import { UpdateService } from '../providers/utils/update.service';
import { RebirthHttpProvider } from 'rebirth-http';
import { HttpClientModule } from '@angular/common/http';
import { MyAppComponent } from './app.component';
import {
  PlatformMock,
  StatusBarMock,
  SplashScreenMock,
} from '../../test-config/mocks-ionic';

import { FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { Insomnia } from '@ionic-native/insomnia';
import { Network } from '@ionic-native/network';
import { BackgroundMode } from '@ionic-native/background-mode';

import { RebirthStorageModule } from 'rebirth-storage';
import { RebirthHttpModule } from 'rebirth-http';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

describe('MyApp Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyAppComponent],
      imports: [
        IonicModule.forRoot(MyAppComponent),
        HttpClientModule,
        RebirthHttpModule,
        CoreModule,
        SharedModule,
      ],
      providers: [
        Network,
        Insomnia,
        File,
        FileTransfer,
        FileOpener,
        GlobalService,
        UpdateService,
        RebirthHttpProvider,
        BackgroundMode,
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock },
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAppComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof MyAppComponent).toBe(true);
  });

  it('should rootPage equals to GuidePage', () => {
    expect(component.rootPage).toBe('LoginPage');
  });
});
