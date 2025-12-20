export interface ITypeSocketEvent {
  userId: string;
  chatRoomId: string;
  status: boolean;
}

export interface IMessagePayload {
  content: string;
  chatId: string;
  sender: string;
  chatRoomId: string;
}
