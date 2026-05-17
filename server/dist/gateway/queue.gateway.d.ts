import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinQueue(data: {
        queueId: string;
    }, client: Socket): void;
    notifyQueueUpdate(queueId: string, payload: {
        type: 'next-called' | 'entry-left' | 'queue-toggled';
        entries: any[];
    }): void;
}
