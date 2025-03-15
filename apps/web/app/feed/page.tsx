'use client';
import { io, Socket } from 'socket.io-client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '../_components/Button';
import { createDevice } from '../../utils/mediasoup';
import { Device } from 'mediasoup-client';
import Link from 'next/link';
import { Transport } from 'mediasoup-client/lib/Transport';
import { AppData } from 'mediasoup-client/lib/types';

type Status =
  | 'disconnected'
  | 'connected'
  | 'created-device'
  | 'created-producer'
  | 'completed';
const VideoStreamPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<Status>('disconnected');
  const [device, setDevice] = useState<Device | null>(null);
  const [consumerTransport, setConsumerTransport] = useState<
    Transport<AppData> | undefined
  >();
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const connect = () => {
    if (status !== 'disconnected') return;
    const socket = io('http://localhost:3030');
    socket.on('connect', async () => {
      setStatus('connected');
    });

    socket.on('disconnect', () => {
      setStatus('disconnected');
    });

    setSocket(socket);
  };

  const loadDevice = async () => {
    if (status !== 'connected' || !socket) return;
    const routerRtpCapabilities = await socket.emitWithAck(
      'get-router-rtp-capabilities',
    );
    const device = await createDevice(routerRtpCapabilities);
    setDevice(device);
    setStatus(device.loaded ? 'created-device' : 'disconnected');
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

  useEffect(() => {
    (async () => {
      await consumeFeed();
      await loadDevice();
      await consumeScreen();
      await consumeFeed();
    })();
  }, []);
  return (
    <main className="min-h-screen bg-gray-100 p-4" onLoad={() => alert('load')}>
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Video Stream {status} {socket ? 'socket' : 'no socket'}
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-center space-x-4 mb-6">
          <Button onClick={connect} disabled={status !== 'disconnected'}>
            Init Connect
          </Button>
          <Button onClick={loadDevice} disabled={status !== 'connected'}>
            Create & Load device
          </Button>
          <Button
            onClick={consumeScreen}
            disabled={status !== 'created-device'}
          >
            Create & Consumer
          </Button>
          <Button
            disabled={status !== 'created-producer'}
            onClick={consumeFeed}
          >
            Consume Feed
          </Button>
        </div>

        <video
          ref={videoPreviewRef}
          className="w-full bg-black rounded-lg aspect-video"
          controls={true}
        />
        <Link
          href="/"
          className="p-3 rounded-md bg-gray-800 my-5 text-white block"
        >
          Home
        </Link>
      </div>
    </main>
  );
};

export default VideoStreamPage;
