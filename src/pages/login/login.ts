import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage, ToastController, NavParams } from 'ionic-angular';
import { OnlineUserService, User } from '@providers/data.service';
import { GlobalService } from '@providers/global.service';
import { RebirthHttpProvider } from 'rebirth-http';
import { JPush } from '@jiguang-ionic/jpush';
import { InfoService } from '@providers/info.service';
import { ChatIOService } from '@providers/utils/socket.io.service';

import { Store } from '@ngrx/store';
import { LoginActionTypes, Login } from './ngrx/login.actions';

import { State } from './ngrx/login.reducer';

@IonicPage()
@Component({
  selector: 'page-login',
  providers: [OnlineUserService, GlobalService, JPush],
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
  user = new User();
  error = '';
  remeberMe = {
    selected: false,
  };
  backgrounds = [
    'assets/imgs/background/background-1.jpg',
    'assets/imgs/background/background-2.jpg',
    'assets/imgs/background/background-3.jpg',
    'assets/imgs/background/background-4.jpg',
    'assets/imgs/background/background-5.jpg',
  ];

  constructor(
    public globalservice: GlobalService,
    public rebirthProvider: RebirthHttpProvider,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    public jPushService: JPush,
    public navParams: NavParams,
    public info: InfoService,
    public chatIO: ChatIOService,
    public store$: Store<State>
  ) {
    this.user.username = navParams.get('username');
    this.user.password = navParams.get('password');
  }

  ngOnInit() {
    console.log('hello `login` component');
    if (this.globalservice.userinfo) {
      this.user.username = this.globalservice.userinfo.username;
      this.user.password = this.globalservice.userinfo.password;
    }
    this.store$.select(state => {
      const loginState = state['login']['login'];
      switch (loginState.actionType) {
        case LoginActionTypes.LOGINSUCCESS:
          this.loginSuccess(loginState);
          break;
        case LoginActionTypes.LOGINFAILED:
          this.loginFailed(loginState);
          break;
        default:
      }
      return state;
    }).subscribe();
  }

  public doLogin(): void {
    console.log('doLogin', this.user);
    this.store$.dispatch(new Login(this.user));
  }

  loginSuccess(retOBJ) {
    let token = '';
    token = retOBJ.token;
    const userinfo = retOBJ.userinfo;
    this.globalservice.token = token;
    this.globalservice.userinfo = JSON.stringify(userinfo);
    this.rebirthProvider.headers({ Authorization: token }, true);
    const jpushAlias = {
      sequence: Math.random(),
      alias: this.user.username,
    };
    this.globalservice.jpushAlias = JSON.stringify(jpushAlias);
    this.jPushService.init().then(v => {
      this.jPushService.setAlias(jpushAlias);
    });
    this.chatIO.login(this.globalservice.userinfo._id);
    this.info.init();
    this.navCtrl.setRoot('TabsPage', {
      animate: true,
    });
  }

  loginFailed(retOBJ) {
    this.error = retOBJ.loginTip;
  }

  public doLogout(): void {
    this.globalservice.token = '';
  }

  public navToRegister(): void {
    this.navCtrl.push('RegisterPage');
  }

  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
