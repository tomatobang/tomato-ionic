import { User } from '../../user/model/user.model';

export class UserFriend {
  _id: string;
  from: User;
  to: User;
  request_time: Date;
  response_time: Date;
  state: number;
  info: string;
  permission_level: number;
}
