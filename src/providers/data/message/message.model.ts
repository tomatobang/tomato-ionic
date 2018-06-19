export class Message {
  from: string;
  to?: string;
  content: string;
  type?: number;
  create_at?: Date;
  has_read?: boolean;
}

export class MessageRet {
  count: number;
  messages: Message;
}
