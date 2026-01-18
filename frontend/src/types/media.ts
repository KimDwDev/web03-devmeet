import { Device, Producer, Transport } from 'mediasoup-client/types';

export type MediaPermission = 'unknown' | 'granted' | 'denied';

export interface MediaState {
  videoOn: boolean;
  audioOn: boolean;
  cameraPermission: MediaPermission;
  micPermission: MediaPermission;
}

type ProducerPromise = (
  track: MediaStreamTrack,
) => Promise<Producer<{ type: string }>>;

export interface Producers {
  produceMic: ProducerPromise | null;
  produceCam: ProducerPromise | null;
  produceScreenVideo: ProducerPromise | null;
  produceScreenAudio: ProducerPromise | null;
}

export interface MediasoupTransports {
  device: Device;
  sendTransport: Transport;
  recvTransport: Transport;
}
