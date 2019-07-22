import { Injectable } from '@angular/core';
import { GlobalService } from '@services/global.service';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { VoicePlayService } from '@services/utils/voiceplay.service';
import { QiniuUploadService } from '@services/qiniu.upload.service';
import { VideoEditor, CreateThumbnailOptions } from '@ionic-native/video-editor/ngx';
import { Observable } from 'rxjs';

@Injectable()
export class FootPrintService {
  isPlaying = false;

  constructor(
    private globalservice: GlobalService,
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private qiniu: QiniuUploadService,
    private voiceService: VoicePlayService,
    private mediaCapture: MediaCapture,
    private videoEditor: VideoEditor
  ) { }

  addPictures(): Observable<any> {
    const isAllowEditPicture = this.globalservice.isAllowEditPicture;
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
                correctOrientation: true,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE,
                targetWidth: 1080,
                targetHeight: 1080,
                allowEdit: isAllowEditPicture
              };

              this.camera.getPicture(options).then(
                FILE_URI => {
                  const indexOfQ = FILE_URI.indexOf('?');
                  if (indexOfQ !== -1) {
                    FILE_URI = FILE_URI.substr(0, indexOfQ);
                  }
                  observer.next(FILE_URI);
                  // const filename =
                  //   'footprint_img_' +
                  //   this.globalservice.userinfo.username +
                  //   '_' +
                  //   new Date().valueOf();
                  // this.qiniu.initQiniu().subscribe(isInit => {
                  //   if (isInit) {
                  //     this.qiniu
                  //       .uploadLocFile(FILE_URI, filename)
                  //       .subscribe(ret => {
                  //         if (ret.data) {
                  //           observer.next({
                  //             data: true,
                  //             value: this.globalservice.qiniuDomain + filename,
                  //           });
                  //           observer.complete();
                  //         } else {
                  //           observer.next(ret);
                  //         }
                  //       });
                  //   }
                  // });
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
                correctOrientation: true,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE,
                targetWidth: 1080,
                targetHeight: 1080,
                allowEdit: isAllowEditPicture
              };

              this.camera.getPicture(options).then(
                FILE_URI => {
                  const indexOfQ = FILE_URI.indexOf('?');
                  if (indexOfQ !== -1) {
                    FILE_URI = FILE_URI.substr(0, indexOfQ);
                  }
                  observer.next(FILE_URI);
                  // const filename =
                  //   'footprint_img_' +
                  //   this.globalservice.userinfo.username +
                  //   '_' +
                  //   new Date().valueOf();
                  // this.qiniu.initQiniu().subscribe(isInit => {
                  //   if (isInit) {
                  //     this.qiniu.uploadLocFile(FILE_URI, filename).subscribe(ret => {
                  //       if (ret.data) {
                  //         observer.next({
                  //           data: true,
                  //           value: this.globalservice.qiniuDomain + filename,
                  //         });
                  //         observer.complete();
                  //       } else {
                  //         observer.next(ret);
                  //       }
                  //     });
                  //   }
                  // });
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

  qiniuFileUpload(FILE_URI) {
    const filename =
      'footprint_img_' +
      this.globalservice.userinfo.username +
      '_' +
      new Date().valueOf();
    return Observable.create(async observer => {
      this.qiniu.initQiniu().subscribe(isInit => {
        if (isInit) {
          this.qiniu.uploadLocFile(FILE_URI, filename).subscribe(ret => {
            if (ret.data) {
              observer.next({
                data: true,
                value: this.globalservice.qiniuDomain + filename,
              });
              observer.complete();
            } else {
              observer.next(ret);
            }
          });
        }
      });
    });
  }

  addVideo() {
    return Observable.create(async observer => {
      const options: CaptureVideoOptions = {
        limit: 1,
        quality: 1, // only support low/high quality mode
      };
      this.mediaCapture.captureVideo(options).then(
        (mediafiles: MediaFile[]) => {
          if (mediafiles.length < 1) {
            observer.error('取消');
            observer.complete();
          }
          console.log(mediafiles[0], (mediafiles[0].size / 1024).toFixed(2) + 'KB');
          const filename =
            'footprint_video_' +
            this.globalservice.userinfo.username +
            '_' +
            new Date().valueOf();

          this.videoEditor.transcodeVideo({
            fileUri: mediafiles[0].fullPath,
            outputFileName: filename + '.mp4',
            optimizeForNetworkUse: this.videoEditor.OptimizeForNetworkUse.YES, // ios only
            maintainAspectRatio: true, // ios only
            videoBitrate: 6000000,
            width: 1280,
            outputFileType: this.videoEditor.OutputFileType.MPEG4
          })
            .then((fileUri: string) => {
              console.log('video transcode success', fileUri);
              // const videofilePath = fileUri ? fileUri.startsWith('file://') ? fileUri : `file://${fileUri}` : '';
              this.qiniu.initQiniu().subscribe(isInit => {
                if (isInit) {
                  this.qiniu.uploadLocFile(fileUri, filename).subscribe(ret => {
                    if (ret.data) {
                      this.createThumbnail(fileUri, filename);
                      observer.next({
                        data: true,
                        value: this.globalservice.qiniuDomain + filename,
                      });
                      observer.complete();
                    } else {
                      observer.next(ret);
                    }
                  });
                }
              });
            })
            .catch((error: any) => console.log('video transcode error', error));
        },
        (error: CaptureError) => {
          console.log('Something went wrong');
          observer.error('视频录制失败：', error);
          observer.complete();
        }
      );
    });
  }

  /**
   * 创建视频缩略图
   * @param fileUri
   * @param outputFileName
   */
  createThumbnail(fileUri, outputFileName) {
    this.videoEditor.createThumbnail({
      fileUri: fileUri,
      atTime: 0.1, // in seconds
      outputFileName: outputFileName + '_thumbnail'
    }).then((thumb_fileUri: string) => {
      this.qiniu.initQiniu().subscribe(isInit => {
        if (isInit) {
          this.qiniu.uploadLocFile(thumb_fileUri, outputFileName + '_thumbnail').subscribe(ret => {
            if (ret.data) {
              console.log('create thumbnail video succeed');
            }
          });
        }
      });
    }, (error: CaptureError) => { });
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
