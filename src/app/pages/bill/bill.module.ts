
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from './../../shared/shared.module';
import { BillPage } from './bill.page';
import { AssetComponent } from './asset/asset.component';
import { addAssetFormComponent } from './asset/addAssetForm/addAssetForm.component';

const routes: Routes = [
  {
    path: '',
    component: BillPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [AssetComponent, addAssetFormComponent],
  declarations: [BillPage, AssetComponent, addAssetFormComponent]
})
export class BillPageModule { }
