export type MessageType = 'MARQUEE' | 'CLOSEDSHOP';

export interface Message {
  id: number;
  type: MessageType;
  content: string;
  isActive: boolean;
}
