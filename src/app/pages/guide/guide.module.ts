import { NgModule } from '@angular/core';
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
  ]
})
export class GuidePageModule { }
