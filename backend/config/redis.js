const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('✅ Redis Connected Successfully');
    } catch (err) {
        console.error('❌ Redis Connection Failed:', err.message);
    }
};

module.exports = {
    redisClient,
    connectRedis
};