import { LoginActionTypes, LoginActionsUnion } from './login.actions';

export interface State {
  actionType: string;
  token: string;
  loginTip: string;
  userinfo: {
    _id: string;
    username: string;
    displayName: string;
    password: string;
    email: string;
    confirmPassword: string;
    bio: string;
  };
  loginRemember: boolean;
}

const loginInit = {
  actionType: 'init',
  token: '',
  loginTip: '',
  userinfo: {
    _id: '',
    username: '',
    displayName: '',
    password: '',
    email: '',
    confirmPassword: '',
    bio: '',
  },
  loginRemember: false,
};

export function loginReducer(state: State = loginInit, action: LoginActionsUnion): State {
  if (action.type) {
    state.actionType = action.type;
  }
  switch (action.type) {
    case LoginActionTypes.LOGINSUCCESS: {
      state.loginTip = '';
      state.userinfo = action.payload.userinfo;
      state.loginRemember = action.payload.loginRemember;
      state.token = action.payload.token;
      break;
    }
    case LoginActionTypes.LOGINFAILED: {
      state.loginTip = '登陆出错！';
      break;
    }
  }
  return state;
}
