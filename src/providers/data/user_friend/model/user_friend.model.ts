import { User } from '../../user/model/user.model';

export class UserFriend {
  _id: string;
  from: User;
  to: User;
  request_time: Date;
  response_time: Date;
  state: Number;
  permission_level: Number;
}
