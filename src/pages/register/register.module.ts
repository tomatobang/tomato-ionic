import { NgModule } from '@angular/core';
import { RegisterPage } from './register';
import { IonicPageModule } from 'ionic-angular';
import { EqualValidator } from '@directives/equal-validator.directive';

@NgModule({
  declarations: [RegisterPage, EqualValidator],
  imports: [IonicPageModule.forChild(RegisterPage)],
})
export class RegisterPageModule {}
