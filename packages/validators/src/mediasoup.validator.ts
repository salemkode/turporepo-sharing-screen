import { type } from 'arktype';

const RtcpFeedback = type({
  type: 'string',
  "parameter?": 'string',
});

export const RtpCodecCapability = type({
  kind: "'audio' | 'video'",
  mimeType: 'string',
  "preferredPayloadType?": 'number',
  clockRate: 'number',
  "channels?": 'number',
  "rtcpFeedback?": RtcpFeedback.array(),
});
export const HeaderExtensionCapability = type({
  kind: "'audio' | 'video'",
  uri: '"urn:ietf:params:rtp-hdrext:sdes:mid" | "urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id" | "urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id" | "http://tools.ietf.org/html/draft-ietf-avtext-framemarking-07" | "urn:ietf:params:rtp-hdrext:framemarking" | "urn:ietf:params:rtp-hdrext:ssrc-audio-level" | "urn:3gpp:video-orientation" | "urn:ietf:params:rtp-hdrext:toffset" | "http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01" | "http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time" | "http://www.webrtc.org/experiments/rtp-hdrext/abs-capture-time" | "http://www.webrtc.org/experiments/rtp-hdrext/playout-delay"',
  preferredId: 'number',
  'preferredEncrypt?': 'boolean',
  'direction?': '"sendrecv" | "sendonly" | "recvonly" | "inactive"',
});
export const RtpCapabilities = type({
  "codecs?": RtpCodecCapability.array(),
  "headerExtensions?": HeaderExtensionCapability.array(),
});

export const IceParameters = type({
  usernameFragment: 'string',
  password: 'string',
  "iceLite?": 'boolean',
});
export const IceCandidate = type({
  foundation: 'string',
  priority: 'number',
  ip: 'string',
  address: 'string',
  protocol: '"udp" | "tcp"',
  port: 'number',
  type: '"host"',
  "tcpType?": '"passive"',
});
export const DtlsFingerprint = type({
  algorithm: "'sha-1' | 'sha-224' | 'sha-256' | 'sha-384' | 'sha-512'",
  value: 'string',
});
export const DtlsParameters = type({
  "role?": '"auto" | "client" | "server"',
  fingerprints: DtlsFingerprint.array(),
});
export const Fingerprint = type({
  hash: 'string',
  setup: 'string',
});
export const ClientTransportParams = type({
  id: 'string',
  iceParameters: IceParameters,
  iceCandidates: IceCandidate.array(),
  dtlsParameters: DtlsParameters,
}).or(type({
  error: 'string',
}));

export const SuccessObject = type({
  success: 'boolean',
});

const RtpEncodingParameters = type({
  "codecPayloadType?": 'number',
  ssrc: 'number',
  "rid?": 'string',
  'rtx?': {
    ssrc: 'number',
  },
  "dtx?": 'boolean',
  "scalabilityMode?": 'string',
  "scaleResolutionDownBy?": 'number',
  "maxBitrate?": 'number',
});
const RtcpParameters = type({
  "cname?": 'string',
  "reducedSize?": 'boolean',
  "mux?": 'boolean',
});

const RtpCodecParameters = type({
  mimeType: 'string',
  payloadType: 'number',
  clockRate: 'number',
  "channels?": 'number',
  "parameters?": 'object',
  'rtcpFeedback?': RtcpFeedback.array(),
});
const RtpHeaderExtensionParameters = type({
  uri: "'urn:ietf:params:rtp-hdrext:sdes:mid' | 'urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id' | 'urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id' | 'http://tools.ietf.org/html/draft-ietf-avtext-framemarking-07' | 'urn:ietf:params:rtp-hdrext:framemarking' | 'urn:ietf:params:rtp-hdrext:ssrc-audio-level' | 'urn:3gpp:video-orientation' | 'urn:ietf:params:rtp-hdrext:toffset' | 'http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01' | 'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time' | 'http://www.webrtc.org/experiments/rtp-hdrext/abs-capture-time' | 'http://www.webrtc.org/experiments/rtp-hdrext/playout-delay'",
  id: 'number',
  "encrypt?": 'boolean',
  "parameters?": 'object',
});
const RtpParameters = type({
  "mid?": 'string',
  codecs: RtpCodecParameters.array(),
  'headerExtensions?': RtpHeaderExtensionParameters.array(),
  'encodings?': RtpEncodingParameters.array(),
  'rtcp?': RtcpParameters,
});
export const ConsumerParams = type({
  producerId: 'string',
  id: 'string',
  "kind?": "'audio' | 'video'",
  rtpParameters: RtpParameters,
});

export const ProducerParams = type({
  success: 'true',
  producerId: 'string',
}).or(type({
  success: 'false',
}));
