import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlobalService } from '@providers/global.service';
import { QiniuUploadService } from '@providers/qiniu.upload.service';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [CommonModule],
  exports: [],
  declarations: [],
  providers: [GlobalService, QiniuUploadService],
})
export class CoreModule {}
