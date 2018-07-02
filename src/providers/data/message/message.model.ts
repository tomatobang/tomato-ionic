export class Message {
  from: string;
  to?: string;
  content: string;
  type?: number;
  create_at?: Date;
  has_read?: boolean;
}

interface MessageRet {
  _id: string;
  count: number;
  messages: Message;
}

export class UnreadMessageRet {
  lst_create_at: string;
  messages: MessageRet[];
}
