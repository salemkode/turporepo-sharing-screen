import { io, type Socket } from 'socket.io-client';
import { type } from 'arktype';
import { Codec, HeaderExtension } from '@repo/validators/mediasoup';

const disconnectEvents: (() => void)[] = [];

const socket = io('http://localhost:3030');

socket.on('disconnect', () => {
  disconnectEvents.forEach((event) => event());
});

const RtpCapabilities = type({
  codecs: Codec.array,
  headerExtensions: HeaderExtension.array,
});
export const getDeviceCapabilities = async () => {
  const rtpCapabilities = RtpCapabilities(
    await socket.emitWithAck('get-router-rtp-capabilities'),
  );
  if (rtpCapabilities instanceof type.errors) {
    throw new Error('Invalid RTP capabilities');
  }
  return rtpCapabilities;
};

export const createTransport = async () => {
  const data = await socket.emitWithAck('create-producer-transport');
  return data;
};
