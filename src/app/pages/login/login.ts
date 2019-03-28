import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { User } from '@services/data.service';
import { GlobalService } from '@services/global.service';
import { RebirthHttpProvider } from 'rebirth-http';
import { JPush } from '@jiguang-ionic/jpush/ngx';
import { InfoService } from '@services/info.service';
import { ChatIOService } from '@services/utils/socket.io.service';
import { Store } from '@ngrx/store';
import { LoginActionTypes, Login } from './ngrx/login.actions';
import { Router, ActivatedRoute } from '@angular/router';
import { State } from './ngrx/login.reducer';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss']
})
export class LoginPage implements OnInit {
  user = new User();
  error = '';
  remeberMe = {
    selected: false,
  };
  slideOpts = {
    effect: 'fade',
    autoplay: {
      delay: 4000
    },
  }
  backgrounds = [
    'assets/imgs/background/background-1.jpg',
    'assets/imgs/background/background-2.jpg',
    'assets/imgs/background/background-3.jpg',
    'assets/imgs/background/background-4.jpg',
    'assets/imgs/background/background-5.jpg',
  ];

  constructor(
    private globalservice: GlobalService,
    private rebirthProvider: RebirthHttpProvider,
    private toastCtrl: ToastController,
    private jPushService: JPush,
    private router: Router,
    private actrouter: ActivatedRoute,
    private info: InfoService,
    private chatIO: ChatIOService,
    private store$: Store<State>
  ) {
    this.actrouter.queryParams.subscribe((queryParams) => {
      this.user.username = queryParams["username"];
      this.user.password = queryParams["password"];
    });
  }

  ngOnInit() {
    console.log('hello `login` component');
    if (this.globalservice.userinfo) {
      this.user.username = this.globalservice.userinfo.username;
      this.user.password = this.globalservice.userinfo.password;
    }
    this.store$
      .select(state => {
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
      })
      .subscribe(d => { });
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
      alias: this.globalservice.userinfo._id,
    };
    this.globalservice.jpushAlias = JSON.stringify(jpushAlias);
    this.jPushService.init()
    this.jPushService.setAlias(jpushAlias).then((args) => {
      console.log('jpush setAlias succeed:', args);
    }).catch(err => {
      console.log('jpush setAlias error:', err);
    });;

    this.chatIO.login(this.globalservice.userinfo._id, this.globalservice.token);
    this.info.init();
    this.router.navigate(['tabs']);
  }

  loginFailed(retOBJ) {
    this.error = retOBJ.loginTip;
  }

  public doLogout(): void {
    this.globalservice.token = '';
  }

  public navToRegister(): void {
    this.router.navigate(['register']);
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });

    await toast.present();
  }

  onKeyPressed() {
    this.error = '';
  }
}
