import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Controller } from '@nestjs/common';
import { ParkingService } from '../parking/parking.service';

@Controller()
@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer()
  private server: Server;
  private userIdArr: string[] = [];
  private socketArr: string[] = [];

  constructor(
    // @InjectRepository(Parking) private parkingRepository: Repository<Parking>,
    private parkingService: ParkingService,
  ) {}

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
  private async handleParking(@MessageBody() parkingInfo: { userId: string }) {
    const { userId } = parkingInfo;
    console.log(userId);

    // const index = this.userIdArr.indexOf(parkingInfo.userId);
    const parkingSlot = await this.parkingService.getParkingSlot();
    await this.parkingService.updateParking(parkingSlot.id, {
      ...parkingSlot,
      isParked: !parkingSlot.isParked,
    });
    this.server.emit('parking', {
      number: parkingSlot.number,
      userId,
    });
  }
}
