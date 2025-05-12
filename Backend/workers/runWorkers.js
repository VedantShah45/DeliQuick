import path from 'path';
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function runCSVWorker() {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(__dirname, 'exports', `partner_metrics_${Date.now()}.csv`);
    const worker = new Worker('./workers/reportWorker.js', {
      workerData: { outputPath }
    });

    worker.on('message', (msg) => {
      if (msg.success) resolve(msg.filePath);
      else reject(new Error(msg.error));
    });

    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  });
}