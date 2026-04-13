import { Request, Response, NextFunction } from 'express';

type QueueItem = {
    req: Request;
    res: Response;
    next: NextFunction;
};

const queues = new Map<string, QueueItem[]>();
const processing = new Set<string>();

const processQueue = async (key: string) => {
    if (processing.has(key)) return;

    const queue = queues.get(key);
    if (!queue || queue.length === 0) {
        processing.delete(key);
        return;
    }

    processing.add(key);
    const item = queue[0];

    // Create a wrapper for next to ensure we process the next item after this one finishes
    const originalNext = item.next;
    const originalSend = item.res.send;
    const originalJson = item.res.json;

    const cleanup = () => {
        queue.shift();
        processing.delete(key);
        processQueue(key);
    };

    // Override res.send and res.json to know when request is finished
    item.res.send = function (...args) {
        const result = originalSend.apply(item.res, args);
        cleanup();
        return result;
    };

    item.res.json = function (...args) {
        const result = originalJson.apply(item.res, args);
        cleanup();
        return result;
    };

    originalNext();
};

/**
 * Middleware to queue requests based on a key (e.g., resource path or collection name)
 * Ensures that requests with the same key are processed sequentially (counter priority).
 */
export const requestQueue = (getKey: (req: Request) => string) => (req: Request, res: Response, next: NextFunction) => {
    const key = getKey(req);

    if (!queues.has(key)) {
        queues.set(key, []);
    }

    queues.get(key)!.push({ req, res, next });
    processQueue(key);
};
