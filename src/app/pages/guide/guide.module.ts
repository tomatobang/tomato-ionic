import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GuidePage } from './guide';
import { CommonModule } from '@angular/common';
import { GuidePageRoutingModule } from './guide.router.module';
@NgModule({
  declarations: [GuidePage],
  imports: [
    IonicModule,
    CommonModule,
    GuidePageRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GuidePageModule { }
