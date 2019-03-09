
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoreModule } from './../../core/core.module';
import { SharedModule } from './../../shared/shared.module';

import { BillPage } from './bill.page';
import { AssetComponent } from './asset/asset.component';

const routes: Routes = [
  {
    path: '',
    component: BillPage
  }
];

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [AssetComponent],
  declarations: [BillPage, AssetComponent]
})
export class BillPageModule { }
