import { parentPort, workerData } from 'worker_threads';
import { generatePartnerOrderMetricsCSV } from '../utils/createCsv.js';

(async () => {
  try {
    const filePath = await generatePartnerOrderMetricsCSV(workerData.outputPath);
    parentPort.postMessage({ success: true, filePath });
  } catch (err) {
    parentPort.postMessage({ success: false, error: err.message });
  }
})();
