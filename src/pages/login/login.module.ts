import { NgModule } from '@angular/core';
import { LoginPage } from './login';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '../../shared/shared.module';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { loginReducer } from './ngrx/login.reducer';
import { LoginEffects } from './ngrx/login.effect';

@NgModule({
  declarations: [LoginPage],
  imports: [
    IonicPageModule.forChild(LoginPage),
    SharedModule,
    StoreModule.forFeature('login', { login: loginReducer }),
    EffectsModule.forFeature([LoginEffects]),
  ],
})
export class LoginPageModule {}
