import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NativeService } from '@services/native.service';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Camera } from '@ionic-native/camera/ngx';

import { SharedModule } from '../../shared/shared.module';
import { FootprintPage } from './footprint.page';
import { FootprintformComponent } from './footprintform/footprintform.component';

const routes: Routes = [
  {
    path: '',
    component: FootprintPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FootprintPage, FootprintformComponent],
  entryComponents: [FootprintformComponent],
  providers: [
    FileTransfer,
    File,
    Camera,
    NativeService,
  ],
})
export class FootprintPageModule { }
