import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  BadRequestException,
  Controller,
  ForbiddenException,
} from '@nestjs/common';
import { ParkingService } from '../parking/parking.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import * as moment from 'moment';

@Controller()
@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer()
  private server: Server;
  private userIdArr: string[] = [];
  private socketArr: string[] = [];

  constructor(
    private parkingService: ParkingService,
    private userService: UsersService,
  ) {}

  @SubscribeMessage('connection')
  private handleCustomConnection(
    @MessageBody() body: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const id = client.id;
    console.log(id);
    if (!this.socketArr.includes(id)) {
      this.socketArr.push(id);
      this.userIdArr.push(body.userId);
    }
  }

  @SubscribeMessage('unparking')
  private async handleUnparking(
    @MessageBody() unparkingInfo: { number: number; userId: string },
  ) {
    const { userId, number } = unparkingInfo;
    const user = await this.userService.findOne(userId);

    this.server.emit('unparking', {
      number,
      userId,
    });
  }

  @SubscribeMessage('parking')
  private async handleParking(@MessageBody() parkingInfo: { userId: string }) {
    const { userId } = parkingInfo;

    const parkingSlot = await this.parkingService.getParkingSlot();
    const user = await this.userService.findOne(userId);
    await this.parkingService.updateParking(parkingSlot.id, {
      isParked: true,
      user,
      date: new Date(),
    });
    this.server.emit('parking', {
      number: parkingSlot.number,
      userId,
    });
  }
}
