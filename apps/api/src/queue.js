import { Queue } from 'bullmq';

// Same host/port as your Redis for ping — BullMQ uses its own internal connections.
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT || 6379),
  maxRetriesPerRequest: null,
};

// Queue name MUST match the Worker you will add in Step 2: 'summarize'
export const summarizeQueue = new Queue('summarize', { connection });