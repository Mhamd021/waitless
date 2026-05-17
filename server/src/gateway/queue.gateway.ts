import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({
  cors: { origin: 'http://localhost:3000' },
})
export class QueueGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-queue')
  handleJoinQueue(
    @MessageBody() data: { queueId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`queue:${data.queueId}`);
    client.emit('joined', { queueId: data.queueId });
  }

  notifyQueueUpdate(queueId: string, payload: {
    type: 'next-called' | 'entry-left' | 'queue-toggled';
    entries: any[];
  }) {
    this.server.to(`queue:${queueId}`).emit('queue-updated', payload);
  }
}