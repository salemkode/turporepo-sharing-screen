import { type } from 'arktype';

export const Codec = type({
  kind: "'audio' | 'video'",
  mimeType: 'string',
  preferredPayloadType: ' number',
  clockRate: 'number',
  channels: 'number',
});
export const HeaderExtension = type({
  kind: "'audio' | 'video'",
  uri: '"urn:ietf:params:rtp-hdrext:sdes:mid" | "urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id" | "urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id" | "http://tools.ietf.org/html/draft-ietf-avtext-framemarking-07" | "urn:ietf:params:rtp-hdrext:framemarking" | "urn:ietf:params:rtp-hdrext:ssrc-audio-level" | "urn:3gpp:video-orientation" | "urn:ietf:params:rtp-hdrext:toffset" | "http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01" | "http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time" | "http://www.webrtc.org/experiments/rtp-hdrext/abs-capture-time" | "http://www.webrtc.org/experiments/rtp-hdrext/playout-delay"',
  preferredId: 'number',
  preferredEncrypt: 'boolean | undefined',
  direction: '"sendrecv" | "sendonly" | "recvonly" | "inactive"',
});
