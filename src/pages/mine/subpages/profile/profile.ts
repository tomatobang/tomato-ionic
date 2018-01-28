import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonicPage,
  ModalController,
  ViewController,
  ActionSheetController,
  Platform
} from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { OnlineUserService } from '../../../../providers/data.service';

import { NativeService } from '../../../../providers/utils/native.service';
import { GlobalService } from '../../../../providers/global.service';
import { debug } from 'util';

declare var window;
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit {
  userid = '';
  username: string;
  sex: string;
  email: string;
  displayName: string;
  location: string;
  bio: string;
  headImg = './assets/tomato-active.png';

  constructor(
    public globalservice: GlobalService,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    public native: NativeService,
    public platform: Platform,
    private userservice: OnlineUserService
  ) {}

  ngOnInit() {
    this.username = this.globalservice.userinfo.username;
    this.email = this.globalservice.userinfo.email;
    this.email = this.email ? this.email : '未知';
    this.sex = this.globalservice.userinfo.sex;
    this.sex = this.sex ? this.sex : 'sec';
    this.displayName = this.globalservice.userinfo.displayName;
    this.displayName = this.displayName ? this.displayName : '未知';

    this.bio = this.globalservice.userinfo.bio;
    this.bio = this.bio ? this.bio : '';

    this.location = this.globalservice.userinfo.location;
    this.location = this.location ? this.location : '未知';

    this.username = this.globalservice.userinfo.username;
    this.userid = this.globalservice.userinfo._id;

    if (this.globalservice.userinfo.img) {
      this.platform.ready().then(readySource => {
        if (readySource === 'cordova') {
          this.native.downloadHeadImg(this.userid, false).then(url => {
            this.headImg = `${url}?${new Date().getTime()}`;
          });
        } else {
          // this.headImg =this.globalservice.serverAddress + "api/user/headimg/" +this.userid;
        }
      });
    }
  }

  /**
   * 更新性别
   */
  changeSex() {
    const profileModal = this.modalCtrl.create('UpdatemodalPage', {
      update: 'sex',
      value: this.sex
    });
    profileModal.onDidDismiss(data => {
      if (!data) {
        return;
      }
      this.sex = data.sex;
      this.userservice
        .updateSex({ userid: this.userid, sex: this.sex })
        .subscribe(userdata => {
          console.log(userdata);
          this.globalservice.userinfo = JSON.parse(userdata._body);
        });
    });
    profileModal.present();
  }

  /**
   * 修改签名
   */
  changeBio() {
    const profileModal = this.modalCtrl.create('UpdatemodalPage', {
      update: 'bio',
      value: this.bio
    });
    profileModal.onDidDismiss(data => {
      if (!data) {
        return;
      }
      this.bio = data.bio;
      this.userservice
        .updateBio({ userid: this.userid, bio: this.bio })
        .subscribe(data => {
          console.log(data);
          this.globalservice.userinfo = JSON.parse(data._body);
        });
    });
    profileModal.present();
  }

  /**
   * 更新昵称
   */
  changeDisplayName() {
    const profileModal = this.modalCtrl.create('UpdatemodalPage', {
      update: 'displayname',
      value: this.displayName
    });
    profileModal.onDidDismiss(data => {
      if (!data) {
        return;
      }
      this.displayName = data.displayname;
      this.userservice
        .updateDisplayName({
          userid: this.userid,
          displayname: this.displayName
        })
        .subscribe(userinfo => {
          this.globalservice.userinfo = JSON.parse(userinfo._body);
        });
    });
    profileModal.present();
  }

  /**
   * 更新邮箱
   */
  changeEmail() {
    const profileModal = this.modalCtrl.create('UpdatemodalPage', {
      update: 'email',
      value: this.email
    });
    profileModal.onDidDismiss(data => {
      if (!data) {
        return;
      }
      this.email = data.email;
      this.userservice
        .updateEmail({ userid: this.userid, email: this.email })
        .subscribe(userdata => {
          console.log(JSON.parse(userdata._body));
          this.globalservice.userinfo = JSON.parse(data._body);
        });
    });
    profileModal.present();
  }

  /**
   * 更新地址
   */
  changeLocation() {
    const profileModal = this.modalCtrl.create('UpdatemodalPage', {
      update: 'location',
      value: this.location
    });
    profileModal.onDidDismiss(data => {
      if (!data) {
        return;
      }
      this.location = data.location;
      this.userservice
        .updateLocation({ userid: this.userid, location: this.location })
        .subscribe(userdata => {
          console.log(userdata);
          this.globalservice.userinfo = JSON.parse(userdata._body);
        });
    });
    profileModal.present();
  }

  /**
   * 头像编辑 modal
   */
  changeHeadImg() {
    const actionSheet = this.actionSheetCtrl.create({
      title: '修改头像',
      buttons: [
        {
          text: '从相册中选择',
          handler: () => {
            console.log('从相册中选择 clicked');
            const options: CameraOptions = {
              quality: 100,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.PNG,
              mediaType: this.camera.MediaType.PICTURE,
              targetWidth: 180,
              targetHeight: 180
            };

            this.camera.getPicture(options).then(
              imageData => {
                // imageData is either a base64 encoded string or a file URI
                // If it's base64:
                const base64Image = 'data:image/jpeg;base64,' + imageData;
                this.userservice
                  .updateUserHeadImg({
                    userid: this.userid,
                    imgData: base64Image
                  })
                  .subscribe(ret => {
                    this.native.downloadHeadImg(this.userid, true).then(url => {
                      this.headImg = url + '?' + new Date().getTime();
                    });
                  });
              },
              err => {
                // Handle error
                console.log('从相册上传头像失败：', err);
              }
            );
          }
        },
        {
          text: '拍摄照片',
          handler: () => {
            console.log('拍摄照片 clicked');
            const options: CameraOptions = {
              quality: 100,
              sourceType: this.camera.PictureSourceType.CAMERA,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.PNG,
              mediaType: this.camera.MediaType.PICTURE,
              targetWidth: 180,
              targetHeight: 180
            };

            this.camera.getPicture(options).then(
              imageData => {
                // imageData is either a base64 encoded string or a file URI
                // If it's base64:
                const base64Image = 'data:image/jpeg;base64,' + imageData;
                this.userservice
                  .updateUserHeadImg({
                    userid: this.userid,
                    imgData: base64Image
                  })
                  .subscribe(ret => {
                    this.native.downloadHeadImg(this.userid, true).then(url => {
                      this.headImg = url + '?' + new Date().getTime();
                    });
                  });
              },
              err => {
                // Handle error
                console.log('拍照上传头像失败：', err);
              }
            );
          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel 修改头像');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
