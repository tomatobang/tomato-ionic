import { Injectable } from '@angular/core';
import { GlobalService } from '@services/global.service';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { VoicePlayService } from '@services/utils/voiceplay.service';
import { QiniuUploadService } from '@services/qiniu.upload.service';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { Observable } from 'rxjs';
import { Helper } from '@services/utils/helper';
declare var window;

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
    private videoEditor: VideoEditor,
    private helper: Helper
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
              this.createThumbnail(fileUri, filename).subscribe(thumb_fileUri => {
                if (thumb_fileUri) {
                  observer.next({
                    videoUrl: fileUri,
                    thumbImg: thumb_fileUri
                  });
                }
                observer.complete();
              });
            })
            .catch((error: any) => {
              observer.error('video transcode error:', error);
              observer.complete();
            });
        },
        (error: CaptureError) => {
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
    return Observable.create(async observer => {
      this.videoEditor.createThumbnail({
        fileUri: fileUri,
        atTime: 0.1, // in seconds
        outputFileName: outputFileName + '_thumbnail'
      }).then((thumb_fileUri: string) => {
        observer.next(thumb_fileUri);
        observer.complete();
      }, (error: CaptureError) => {
        observer.error(error);
        observer.complete();
      });

    });
  }

  qiniuFileUpload(FILE_URI, filename) {
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

  playLocalVoice(mediaSrc) {
    this.voiceService.play(mediaSrc).then(() => {
    });
  }

  uploadPictures(pictureUrl, loading, total, index): Observable<any> {
    return Observable.create(async observer => {
      if (pictureUrl) {
        const remoteFileName = 'footprint_img_' + this.globalservice.userinfo.username +
          '_' +
          new Date().valueOf();
        console.log('准备上传:', pictureUrl);
        this.qiniuFileUpload(pictureUrl, remoteFileName).subscribe(ret => {
          if (ret && ret.data) {
            console.log('上传成功:', pictureUrl);
            observer.next({
              type: 'picture',
              value: ret.value
            });
            observer.complete();
          } else if (ret && !ret.data) {
            const downloadProgress = window.parseInt(
              ret.value * 100,
              10
            );
            loading.message = `<div>图片(${index}/${total})已完成${downloadProgress}%</div>`;
          }

        }, async err => {
          console.error(err);
          loading.dismiss();
          this.helper.createToast('上传失败，请重试!');
        });
      } else {
        observer.next('');
        observer.complete();
      }
    });
  }

  uploadVideos(videoObj, loading, total, index): Observable<any> {
    return Observable.create(async observer => {
      if (videoObj) {
        console.log('准备上传视频:', videoObj.videoUrl);
        const remoteFileName = 'footprint_video_' + this.globalservice.userinfo.username +
          '_' +
          new Date().valueOf();
        // 上传视频
        this.qiniuFileUpload(videoObj.videoUrl, remoteFileName).subscribe(videoRet => {
          if (videoRet && videoRet.data) {
            console.log('视频上传成功:', videoRet.value);
            // 上传缩略图
            this.qiniuFileUpload(videoObj.thumbnailRawUrl, remoteFileName + '_thumbnail').subscribe(thumbnailRet => {
              if (thumbnailRet && thumbnailRet.data) {
                console.log('视频缩略图上传成功:', thumbnailRet.data);
                observer.next({
                  type: 'video',
                  value: videoRet.value
                });
                observer.complete();
              }
            });

          } else if (videoRet && !videoRet.data) {
            const downloadProgress = window.parseInt(
              videoRet.value * 100,
              10
            );
            loading.message = `<div>视频(${index}/${total})已完成${downloadProgress}%</div>`;
          }

        }, async err => {
          console.error(err);
          loading.dismiss();
          this.helper.createToast('上传视频失败，请重试!');
        });
      } else {
        observer.next('');
        observer.complete();
      }
    });
  }

  uploadVoices(voicesUrl, loading, total, index): Observable<any> {
    return Observable.create(async observer => {
      if (voicesUrl) {
        console.log('准备上传语音:', voicesUrl.uploadMediaFilepath);
        let fileName = voicesUrl.uploadMediaFilepath.substr(
          voicesUrl.uploadMediaFilepath.lastIndexOf('/') + 1
        );
        fileName = 'footprint_voice_' + fileName;
        this.qiniuFileUpload(voicesUrl.uploadMediaFilepath, fileName).subscribe(ret => {
          if (ret && ret.data) {
            console.log('上传成功:', fileName);
            observer.next({
              type: 'voice',
              value: ret.value
            });
            observer.complete();
          } else if (ret && !ret.data) {
            const downloadProgress = window.parseInt(
              ret.value * 100,
              10
            );
            loading.message = `<div>语音(${index}/${total})已完成${downloadProgress}%</div>`;
          }
        }, async err => {
          console.error(err);
          loading.dismiss();
          this.helper.createToast('上传语音失败，请重试!');
        });
      } else {
        observer.next('');
        observer.complete();
      }
    });
  }

}
