import { io } from 'socket.io-client';
import { type } from 'arktype';
import {
  ClientTransportParams,
  ConsumerParams,
  ProducerParams,
  RtpCapabilities as RtpCapabilitiesValidator,
  SuccessObject,
} from '@repo/validators/mediasoup';
import { AppData, DtlsParameters, RtpCapabilities, RtpParameters } from 'mediasoup-client/lib/types';

const disconnectEvents: (() => void)[] = [];
const producerCreatedEvents: ((producerId: string) => void)[] = [];
const socket = io('http://localhost:3030');

socket.on('disconnect', () => {
  disconnectEvents.forEach((event) => event());
});

socket.on('producer-created', (producerId: string) => {
  producerCreatedEvents.forEach((event) => event(producerId));
});

export const onProducerCreated = (event: (producerId: string) => void) => {
  producerCreatedEvents.push(event);
  return () => {
    const index = producerCreatedEvents.indexOf(event);
    if (index > -1) {
      producerCreatedEvents.splice(index, 1);
    }
  };
};

export const checkProducer = async () => {
  const isProducerActive = await socket.emitWithAck('check-producer');
  return isProducerActive;
};

export const getDeviceCapabilities = async () => {
  const rtpCapabilities = RtpCapabilitiesValidator(
    await socket.emitWithAck('get-router-rtp-capabilities'),
  );
  if (rtpCapabilities instanceof type.errors) {
    throw new Error('Invalid RTP capabilities');
  }
  return rtpCapabilities;
};

export const createTransport = async () => {
  const data = await socket.emitWithAck('create-transport');
  const clientTransportParams = ClientTransportParams(data);

  if (clientTransportParams instanceof type.errors) {
    throw new Error('Invalid client transport params');
  }
  return clientTransportParams;
};

export const transportConnect = async (
  transportId: string,
  dtlsParameters: DtlsParameters,
) => {
  const response = SuccessObject(
    await socket.emitWithAck('transport-connect', {
      transportId,
      dtlsParameters,
    }),
  );
  if (response instanceof type.errors) {
    throw new Error('Invalid transport connect response');
  }
  return response;
};

export const getConsumerParams = async (rtpCapabilities: RtpCapabilities) => {
  alert('getConsumerParams');
  const response = ConsumerParams(
    await socket.emitWithAck('consume-media', {
      rtpCapabilities,
    }),
  );
  if (response instanceof type.errors) {
    throw new Error('Invalid consume media response');
  }
  return response;
};

export const unpauseConsumer = (consumerId: string) => {
  socket.emit('unpause-consumer', { consumerId });
};

export const startProduce = async (param: {
  kind: 'audio' | 'video';
  rtpParameters: RtpParameters;
  appData: AppData;
}) => {
  const response = ProducerParams(
    await socket.emitWithAck('start-produce', param),
  );
  if (response instanceof type.errors) {
    throw new Error('Invalid start produce response');
  }
  return response;
};

export const onDisconnect = (event: (() => void)) => {
  disconnectEvents.push(event);
};
