import * as mediasoup from 'mediasoup-client';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { getDeviceCapabilities } from './signaling';

export const createDevice = async (rtpCapabilities: RtpCapabilities) => {
  const device = new mediasoup.Device();
  await device.load({ routerRtpCapabilities: rtpCapabilities });
  return device;
};

export const consumerFlow = async () => {
  const rtpCapabilities = await getDeviceCapabilities();
  const device = await createDevice(rtpCapabilities);
};

const consumeScreen = async () => {
  if (status !== 'created-device' || !socket) return;

  // I will use the same transport for both producer and consumer
  const data = await socket.emitWithAck('create-producer-transport');
  const producer = device?.createRecvTransport(data);
  setConsumerTransport(producer);
  if (!producer) return;
  setStatus('created-producer');

  // Transport will not fire until transport.produce() is called
  producer?.on('connect', async ({ dtlsParameters }, callback, errback) => {
    console.log('connect', dtlsParameters);
    const response: { success: boolean } = await socket?.emitWithAck(
      'transport-connect',
      {
        transportId: producer.id,
        dtlsParameters,
      },
    );
    console.log('transport-connect', response);
    if (response.success) {
      callback();
      setStatus('completed');
    } else {
      errback(new Error('Failed to connect'));
    }
  });

  producer?.on('produce', async (param, callback, errback) => {
    const response = await socket?.emitWithAck('start-produce', param);
    console.log('start-produce', response);
    if (response === 'error') {
      errback(new Error('Failed to start produce'));
    } else {
      console.log('Congratulations! You are connected to the server');
      callback(response);
    }
  });
};

const consumeFeed = async () => {
  if (status !== 'created-producer' || !socket || !device) return;
  const consumerParams = await socket.emitWithAck('consume-media', {
    rtpCapabilities: device.rtpCapabilities,
  });
  console.log('consume-media', device.rtpCapabilities);
  if ('error' in consumerParams) {
    console.error('consume-media', consumerParams.error);
    return;
  }

  const consumer = await consumerTransport?.consume({
    producerId: consumerParams.producerId,
    id: consumerParams.id,
    kind: consumerParams.kind,
    rtpParameters: consumerParams.rtpParameters,
  });

  const videoElement = videoPreviewRef.current;
  if (!videoElement || !consumer?.track) return;
  videoElement.srcObject = new MediaStream([consumer.track]);
  socket.emit('unpause-consumer');
};
