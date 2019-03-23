import { NgModule } from '@angular/core';
import { LoginPage } from './login';
import { IonicModule } from '@ionic/angular';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { loginReducer } from './ngrx/login.reducer';
import { LoginEffects } from './ngrx/login.effect';

import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { LoginPageRoutingModule } from './login.router.module';

import {
  ChatIOService,
} from '@services/utils/socket.io.service';
declare var window;

@NgModule({
  declarations: [LoginPage],
  imports: [
    IonicModule,
    LoginPageRoutingModule,
    SharedModule, CoreModule,
    StoreModule.forFeature('login', { login: loginReducer }),
    EffectsModule.forFeature([LoginEffects]),
  ],
  providers: [{ provide: ChatIOService, useValue: window.appChatIOService }]
})
export class LoginPageModule { }
