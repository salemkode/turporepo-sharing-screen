import { cpus } from 'node:os';
import config from './config.js';
import MediaSoup from 'mediasoup';

const createWorker = async () => {
  const numCPUs = cpus().length;
  const workers = [];

  for (let i = 0; i < numCPUs; i++) {
    const worker = await MediaSoup.createWorker({
      logLevel: config.workerSetting.logLevel,
      logTags: config.workerSetting.logTags,
      rtcMinPort: config.workerSetting.rtcMinPort,
      rtcMaxPort: config.workerSetting.rtcMaxPort,
    });

    worker.on('died', () => {
      process.exit(1);
    });

    workers.push(worker);
  }
  return workers;
};

export default createWorker;
