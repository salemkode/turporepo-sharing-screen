import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import config from './config.js';
import createWorker from './createWorker.js';
import type MediaSoup from 'mediasoup';
import { RtpCapabilities as RtpCapabilitiesValidator, ClientTransportParams as ClientTransportParamsValidator } from '@repo/validators/mediasoup';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Serve static files if needed
app.use(express.static('public'));

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

// MediaSoup implementation
let workers: MediaSoup.types.Worker[] = [];
let router: MediaSoup.types.Router | undefined;
const initMediaSoup = async () => {
  workers = await createWorker();
  router = await workers[0]!.createRouter({
    mediaCodecs: config.mediaCodecs,
  });
};
initMediaSoup();

let producer: MediaSoup.types.Producer | undefined;
io.on('connection', (socket) => {
  let transport: MediaSoup.types.WebRtcTransport | undefined;
  let consumer: MediaSoup.types.Consumer | undefined;

  socket.on(
    'get-router-rtp-capabilities',
    async (ack: (rtpCapabilities: typeof RtpCapabilitiesValidator.infer) => void) => {
      console.log('get-router-rtp-capabilities');
      const rtpCapabilities = router?.rtpCapabilities;
      if (!rtpCapabilities) return;
      ack(rtpCapabilities);
    },
  );

  socket.on('create-transport', async (ack: (transport: typeof ClientTransportParamsValidator.infer) => void) => {
    console.log('create-transport');
    if (!router) {
      ack({ error: 'Router not initialized' });
      return;
    }
    transport = await router.createWebRtcTransport({
      listenInfos: [
        {
          protocol: 'udp',
          ip: '127.0.0.1',
          announcedIp: '127.0.0.1',
        },
        {
          protocol: 'tcp',
          ip: '127.0.0.1',
          announcedIp: '127.0.0.1',
        },
      ],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });

    const clientTransportParams = {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    };
    ack(clientTransportParams);
    console.log('transport created', transport.id);
  });

  socket.on('transport-connect', async (params, ack) => {
    try {
      await transport?.connect(params);
      ack({ success: true });
      if (params.id === producer?.id) {
        producer?.resume();
      }
    } catch (error) {
      console.error('transport-connect', error);
      ack({ success: false });
    }
  });

  socket.on('start-produce', async (params, ack: (producerId?: {
    success: boolean,
    producerId?: string,
  }) => void) => {
    try {
      producer = await transport?.produce({
        id: params.id,
        kind: params.kind,
        rtpParameters: params.rtpParameters,
        paused: false,
      });
      ack({
        success: true,
        producerId: producer?.id,
      });

      io.emit('producer-created', producer?.id);
    } catch (error) {
      console.error('start-produce', error);
      ack({
        success: false,
        producerId: undefined,
      });
    }
  });

  socket.on('consume-media', async ({ rtpCapabilities }, ack) => {
    // setup client consumer
    if (
      !producer ||
      !router?.canConsume({ producerId: producer.id, rtpCapabilities })
    ) {
      ack({ error: 'Router cannot consume media' });
      return;
    }
    consumer = await transport?.consume({
      producerId: producer.id,
      rtpCapabilities,
      paused: true,
    });

    ack({
      producerId: producer.id,
      id: consumer?.id,
      kind: consumer?.kind,
      rtpParameters: consumer?.rtpParameters,
    });
  });

  socket.on('unpause-consumer', async () => {
    await consumer?.resume();
  });
});

io.on('disconnect', (socket) => {
  console.log('a user disconnected');
});
