import { Injectable } from '@angular/core';
import { Socket } from 'ng2-socket-io';

@Injectable()
export class SocketService {
    constructor(private socket: Socket) { }

    sendMessage(evt: string, msg: string) {
        this.socket.emit(evt, msg);
    }

    getMessage() {
        return this.socket.fromEvent("msgd").map(data => data);
    }

    connect() {
        this.socket.connect();
    }

    close() {
        this.socket.disconnect();
    }
}