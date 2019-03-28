import { NgModule } from '@angular/core';
import { LoginPage } from './login';
import { IonicModule } from '@ionic/angular';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { loginReducer } from './ngrx/login.reducer';
import { LoginEffects } from './ngrx/login.effect';

import { SharedModule } from '../../shared/shared.module';
import { LoginPageRoutingModule } from './login.router.module';

@NgModule({
  declarations: [LoginPage],
  imports: [
    IonicModule,
    LoginPageRoutingModule,
    SharedModule,
    StoreModule.forFeature('login', { login: loginReducer }),
    EffectsModule.forFeature([LoginEffects]),
  ],
})
export class LoginPageModule { }
