import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({})
export class SocketGateway {
  @WebSocketServer()
  private server: Server;

  private userIdArr: string[] = [];
  private socketArr: string[] = [];

  @SubscribeMessage('connection')
  private handleCustomConnection(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const id = client.id;
    console.log(id);
    if (!this.socketArr.includes(id)) {
      this.socketArr.push(id);
      this.userIdArr.push(userId);
    }
  }

  @SubscribeMessage('parking')
  private handleParking(
    @MessageBody() parkingInfo: { number: number; userId: string },
  ) {
    const { userId, number } = parkingInfo;
    // this.userIdArr.forEach((el) => console.log(el));
    // this.socketArr.forEach((el) => console.log(el));
    const index = this.userIdArr.indexOf(parkingInfo.userId);
    // console.log(index);
    if (index < 0) return;
    this.server.volatile.emit('parking', {
      number,
      userId,
    });
  }
}
