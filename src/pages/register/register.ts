/**
 * TODO
 * 1. 微信
 * 3. 手机号
 */

import { Component } from '@angular/core';
import {
  NavController,
  IonicPage,
  ToastController,
  NavParams
} from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OnlineUserService, User } from '../../providers/data.service';
import { GlobalService } from '../../providers/global.service';
import { RebirthHttpProvider } from 'rebirth-http';
import { JPushService } from '../../providers/utils/jpush.service';

@IonicPage()
@Component({
  selector: 'register',
  providers: [OnlineUserService, GlobalService, JPushService],
  templateUrl: 'register.html'
})
export class RegisterPage {
  userForm: FormGroup;
  user = new User();
  error = '';
  remeberMe = {
    selected: false
  };
  public formErrors = {
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    formError: ''
  };
  validationMessages = {
    username: {
      required: '用户名必须输入。', //
      minlength: '用户名4到32个字符。'
    },
    displayName: {
      required: '昵称必须输入。',
      minlength: '昵称2到32个字符。'
    },
    email: {
      required: '邮箱必须输入。',
      pattern: '请输入正确的邮箱地址。'
    },
    password: {
      required: '密码必须输入。',
      minlength: '密码至少要6位。'
    },
    confirmPassword: {
      required: '重复密码必须输入。',
      minlength: '密码至少要6位。',
      validateEqual: '两次输入的密码不一致。'
    }
  };

  constructor(
    public fb: FormBuilder,
    public service: OnlineUserService,
    public globalservice: GlobalService,
    public rebirthProvider: RebirthHttpProvider,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    public jPushService: JPushService,
    public navParams: NavParams
  ) {
    this.user.username = '';
    this.user.password = '';
    this.user.email = '';
    this.user.displayName = '';
    this.user.confirmPassword = '';
  }

  ngOnInit() {
    console.log('hello `login` component');
    if (this.globalservice.userinfo) {
    }
    this.buildForm();
  }

  public doRegister(): void {
    console.log('doRegister', this.user);
    if (this.userForm.valid) {
      console.log(this.user);
      this.user = this.userForm.value;
      this.service
        .verifyUserNameEmail({
          email: this.user.email,
          username: this.user.username
        })
        .subscribe(data => {
          const ret: any = JSON.parse(data._body);
          // 邮箱可用
          if (ret.success) {
            this.service.register(this.user).subscribe(
              d => {
                alert('注册成功！即将跳转至登录页...');
                this.globalservice.userinfo = JSON.stringify(this.user);
                this.navToLogin();
              },
              error => {
                this.formErrors.formError = error.message;
                console.error(error);
              }
            );
          } else {
            if (ret.msg === '用户名已存在！') {
              this.formErrors['username'] += ret.msg;
            }
            if (ret.msg === '邮箱已存在！') {
              this.formErrors['email'] += ret.msg;
            }
          }
        });
    } else {
      this.formErrors.formError = '存在不合法的输入项，请检查。';
    }
  }

  buildForm(): void {
    this.userForm = this.fb.group({
      username: [
        this.user.username,
        [Validators.required, Validators.minLength(4), Validators.maxLength(32)]
      ],
      displayName: [
        this.user.displayName,
        [Validators.required, Validators.minLength(2), Validators.maxLength(32)]
      ],
      email: [
        this.user.email,
        [
          Validators.required,
          Validators.pattern(
            '^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$'
          )
        ]
      ],
      password: [
        this.user.password,
        [Validators.required, Validators.minLength(6)]
      ],
      confirmPassword: [
        this.user.confirmPassword,
        [Validators.required, Validators.minLength(6)]
      ]
    });
    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.userForm) {
      return;
    }
    const form = this.userForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  public navToLogin(): void {
    // 注册
    this.navCtrl.setRoot('LoginPage');
  }

  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
