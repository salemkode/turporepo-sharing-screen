import type MediaSoup from 'mediasoup';

const config = {
  port: Number(process.env.PORT) || 3030,
  workerSetting: {
    rtcMinPort: 10000,
    rtcMaxPort: 10100,
    logLevel: 'warn',
    logTags: [
      'info',
      'ice',
      'dtls',
      'rtp',
      'srtp',
      'rtcp',
      'rtx',
      'bwe',
      'score',
      'simulcast',
      'svc',
      'sctp',
    ] as MediaSoup.types.WorkerLogTag[],
  },
  mediaCodecs: [
    {
      mimeType: 'audio/opus',
      kind: 'audio',
      clockRate: 48000,
      channels: 2,
    },
    {
      mimeType: 'video/H264',
      kind: 'video',
      clockRate: 90000,
      parameters: {
        'packetization-mode': 1,
        'level-asymmetry-allowed': 1,
        'profile-level-id': '42e01f',
      },
    },
    {
      mimeType: 'video/VP8',
      kind: 'video',
      clockRate: 90000,
      parameters: {},
    },
  ] as MediaSoup.types.RtpCodecCapability[],
} as const;

export default config;
