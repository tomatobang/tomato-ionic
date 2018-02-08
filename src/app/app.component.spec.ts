import { async, TestBed } from "@angular/core/testing";
import { IonicModule, Platform } from "ionic-angular";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { GlobalService } from "../providers/global.service";
import { RebirthHttpProvider } from "rebirth-http";
import { BackgroundMode } from "@ionic-native/background-mode";

import { MyAppComponent } from "./app.component";
import {
  PlatformMock,
  StatusBarMock,
  SplashScreenMock
} from "../../test-config/mocks-ionic";

describe("MyApp Component", () => {
  let fixture;
  let component;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [MyAppComponent],
        imports: [IonicModule.forRoot(MyAppComponent)],
        providers: [
          GlobalService,
          RebirthHttpProvider,
          BackgroundMode,
          { provide: StatusBar, useClass: StatusBarMock },
          { provide: SplashScreen, useClass: SplashScreenMock },
          { provide: Platform, useClass: PlatformMock }
        ]
      });
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAppComponent);
    component = fixture.componentInstance;
  });

  it("should be created", () => {
    expect(component instanceof MyAppComponent).toBe(true);
  });

  it("should rootPage equals to GuidePage", () => {
    expect(component.rootPage).toBe("LoginPage");
  });
});
