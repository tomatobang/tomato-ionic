import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GlobalService } from '@services/global.service';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { VoicePlayService } from '@services/utils/voiceplay.service';
import { Helper } from '@services/utils/helper';
import { QiniuUploadService } from '@services/qiniu.upload.service';
import { Observable } from 'rxjs';

@Injectable()
export class FootPrintService {
  isPlaying = false;

  constructor(
    public platform: Platform,
    public globalservice: GlobalService,
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private qiniu: QiniuUploadService,
    private voiceService: VoicePlayService,
    private helper: Helper,
  ) { }

  addPictures(): Observable<any> {
    return Observable.create(async observer => {
      const actionSheet = await this.actionSheetCtrl.create({
        header: '添加图片',
        buttons: [
          {
            text: '从相册中选择',
            handler: () => {
              console.log('从相册中选择 clicked');
              const options: CameraOptions = {
                quality: 100,
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: this.camera.DestinationType.FILE_URI,
                encodingType: this.camera.EncodingType.PNG,
                mediaType: this.camera.MediaType.PICTURE,
                targetWidth: 540,
                targetHeight: 540,
                allowEdit: true
              };

              this.camera.getPicture(options).then(
                FILE_URI => {
                  const indexOfQ = FILE_URI.indexOf('?');
                  if (indexOfQ !== -1) {
                    FILE_URI = FILE_URI.substr(0, indexOfQ);
                  }
                  const filename =
                    'footprint_img_' +
                    this.globalservice.userinfo.username +
                    '_' +
                    new Date().valueOf();
                  this.qiniu.initQiniu().subscribe(isInit => {
                    if (isInit) {
                      this.qiniu
                        .uploadLocFile(FILE_URI, filename)
                        .subscribe(data => {
                          observer.next(this.globalservice.qiniuDomain + filename);
                          observer.complete();
                        });
                    }
                  });
                },
                err => {
                  console.log('从相册上传图片失败：', err);
                }
              );
            },
          },
          {
            text: '拍摄照片',
            handler: () => {
              console.log('拍摄照片 clicked');
              const options: CameraOptions = {
                quality: 100,
                saveToPhotoAlbum: true,
                sourceType: this.camera.PictureSourceType.CAMERA,
                destinationType: this.camera.DestinationType.FILE_URI,
                encodingType: this.camera.EncodingType.PNG,
                mediaType: this.camera.MediaType.PICTURE,
                targetWidth: 540,
                targetHeight: 540,
                allowEdit: true
              };

              this.camera.getPicture(options).then(
                FILE_URI => {
                  const indexOfQ = FILE_URI.indexOf('?');
                  if (indexOfQ !== -1) {
                    FILE_URI = FILE_URI.substr(0, indexOfQ);
                  }
                  const filename =
                    'footprint_img_' +
                    this.globalservice.userinfo.username +
                    '_' +
                    new Date().valueOf();
                  this.qiniu.initQiniu().subscribe(isInit => {
                    if (isInit) {
                      this.qiniu.uploadLocFile(FILE_URI, filename).subscribe(data => {
                        observer.next(this.globalservice.qiniuDomain + filename);
                        observer.complete();
                      });
                    }
                  });
                },
                err => {
                  console.log('拍照上传图片失败：', err);
                  observer.error('拍照上传图片失败：', err);
                  observer.complete();
                }
              );
            },
          },
          {
            text: '取消',
            role: 'cancel',
            handler: () => {
              observer.next();
              observer.complete();
              console.log('Cancel 修改图片');
            },
          },
        ],
      });
      await actionSheet.present();
    });
  }

  uploadVoiceFile(uploadMediaFilepath, fileName) {
    return new Promise((resolve, reject) => {
      this.qiniu.initQiniu().subscribe(data => {
        if (data) {
          this.qiniu
            .uploadLocFile(
              uploadMediaFilepath,
              fileName
            )
            .subscribe(ret => {
              if (ret.data) {
                resolve(fileName);
              } else {
                resolve('');
              }
            });
        }
      });
    });
  }

  playLocalVoice(mediaSrc) {
    this.voiceService.play(mediaSrc).then(() => {
    });
  }

}
