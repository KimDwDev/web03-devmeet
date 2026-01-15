import { Device } from 'mediasoup-client';
import { Transport } from 'mediasoup-client/types';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';

interface MeetingSocketState {
  socket: Socket | null;
  device: Device | null;
  sendTransport: Transport | null;
  recvTransport: Transport | null;
}

interface MediasoupTransports {
  device: Device;
  sendTransport: Transport;
  recvTransport: Transport;
}

interface MeetingSocketAction {
  setSocket: (socket: Socket | null) => void;

  setMediasoupTransports: ({
    device,
    sendTransport,
    recvTransport,
  }: MediasoupTransports) => void;
}

export const useMeetingSocketStore = create<
  MeetingSocketState & MeetingSocketAction
>((set) => ({
  socket: null,
  device: null,
  sendTransport: null,
  recvTransport: null,

  setSocket: (socket) => set({ socket }),
  setMediasoupTransports: (transports) => set({ ...transports }),
}));
