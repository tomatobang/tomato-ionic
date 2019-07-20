import { NgModule } from '@angular/core';
import { RegisterPage } from './register';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { RegisterPageRoutingModule } from './register.router.module';

@NgModule({
  declarations: [RegisterPage],
  imports: [IonicModule, RegisterPageRoutingModule, SharedModule],
})
export class RegisterPageModule { }
