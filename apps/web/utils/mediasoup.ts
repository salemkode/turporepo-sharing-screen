import * as mediasoup from 'mediasoup-client';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import {
  createTransport,
  getConsumerParams,
  getDeviceCapabilities,
  startProduce,
  transportConnect,
} from './signaling';

export const createDevice = async (rtpCapabilities: RtpCapabilities) => {
  const device = new mediasoup.Device();
  await device.load({ routerRtpCapabilities: rtpCapabilities });
  return device;
};

const getTransportData = async () => {
  const rtpCapabilities = await getDeviceCapabilities();
  const device = await createDevice(rtpCapabilities);
  const clientTransportParams = await createTransport();
  return { device, clientTransportParams };
};
export const consumerFlow = async () => {
  const { device, clientTransportParams } = await getTransportData();
  if (!device || 'error' in clientTransportParams) {
    alert('Failed to get transport data');
    return;
  }
  const producer = device?.createRecvTransport(clientTransportParams);
  // Transport will not fire until transport.produce() is called
  producer?.on('connect', async ({ dtlsParameters }, callback, err) => {
    const response = await transportConnect(producer.id, dtlsParameters);
    if (!response.success) {
      err(new Error('Failed to connect'));
    } else {
      callback();
    }
  });

  const consumerParams = await getConsumerParams(device.rtpCapabilities);
  const consumer = await producer?.consume({
    producerId: consumerParams.producerId,
    id: consumerParams.id,
    kind: consumerParams.kind,
    rtpParameters: consumerParams.rtpParameters,
  });
  return consumer;
};

export const createProducer = async () => {
  const { device, clientTransportParams } = await getTransportData();
  if (!device || 'error' in clientTransportParams) {
    alert('Failed to get transport data');
    return;
  }

  const producer = device?.createSendTransport(clientTransportParams);

  // Transport will not fire until transport.produce() is called
  // Transport will not fire until transport.produce() is called
  producer?.on('connect', async ({ dtlsParameters }, callback, err) => {
    const response = await transportConnect(producer.id, dtlsParameters);
    if (!response.success) {
      err(new Error('Failed to connect'));
    } else {
      callback();
    }
  });

  producer?.on('produce', async (param, callback, err) => {
    const response = await startProduce(param);
    if (!response.success) {
      err(new Error('Failed to start produce'));
    } else {
      console.log('Congratulations! You are connected to the server');
      callback({ id: response.producerId });
    }
  });
  return producer;
};
