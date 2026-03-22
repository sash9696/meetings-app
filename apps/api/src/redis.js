import Redis from 'ioredis';

const host = process.env.REDIS_PORT || 'localhost';
const port = process.env.REDIS_PORT || 6379;

export const redis =  new Redis({
    host,
    port,
    maxRetriesPerRequest : null
});

export async function pingRedis(){
    const pong  = await redis.ping();
    return pong === 'PONG';
}