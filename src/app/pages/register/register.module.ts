import { NgModule } from '@angular/core';
import { RegisterPage } from './register';
import { IonicModule } from '@ionic/angular';
import { EqualValidator } from '@directives/equal-validator.directive';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { RegisterPageRoutingModule } from './register.router.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RegisterPage, EqualValidator],
  imports: [IonicModule, RegisterPageRoutingModule, CoreModule, SharedModule, FormsModule, ReactiveFormsModule],
})
export class RegisterPageModule { }
