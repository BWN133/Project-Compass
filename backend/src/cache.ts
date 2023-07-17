import type { RedisClientType } from 'redis'
import { createClient } from 'redis'

let redisClient: RedisClientType

async function getCache(): Promise<RedisClientType> {
    redisClient = createClient();

    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    await redisClient.connect();
    return redisClient;
}

getCache().then(connection => {
    redisClient = connection
    console.log("Redis connected");
}).catch(err => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    console.error({ err }, 'Failed to connect to Redis')
})

export {
    getCache,
}