

// step 1 folder layout + env

//step 2 mongo + redis

// step 3 Api shell + DB

// step 4 Auth (users + JWT)

// step 5 meetings crud operations

//step 6 Queue + summarize (API) => bullmq and ioredis

//step 7 => worker + mock LLM (hardcode response)

// step 8 dockerize api + worker + nginx

// step 9 React

// Step 10 OLLAMA

// 

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDb, isMongoReady } from './db.js';
import { pingRedis } from './redis.js';
import authRoutes from './routes/auth.js'
import meetingsRoutes from './routes/meetings.js'
import dashboardRoutes from './routes/dashboard.js'
import usersRoutes from './routes/users.js'
import { authMiddleware } from './middleware/auth.js';

const app = express();
const port = process.env.PORT || 3000;


// middlewares => runs before route handlers

app.use(cors({origin:true, credentials:true}))


app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ok:true})
})

app.get('/api/ready', async (req, res) => {
    try {

        const mongoOk = isMongoReady();
        console.log('mongoOk',mongoOk)
        const redisOk = await pingRedis();
        if(mongoOk && redisOk) return res.json({ok:true, mongo:true, redis:true});
        //503 the service is unavailable
        return res.status(503).json({ok:false, mongo:mongoOk, redis:redisOk})
        
    } catch (error) {
        return res.status(503).json({ok:false})

    }
})

app.get('/api/instance', (req, res) => {
    res.json({
        instanceId: process.env.INSTANCE_ID || process.env.HOSTNAME || 'unknown'
    })
})

// auth
app.use('/api/auth', authRoutes);
// meetings
app.use('/api/meetings', authMiddleware, meetingsRoutes)
app.use('/api/dashboard', authMiddleware, dashboardRoutes)
app.use('/api/users', authMiddleware, usersRoutes)

await connectDb();

app.listen(port, '0.0.0.0', () => {
    console.log(`API listening on ${port} instance=${process.env.INSTANCE_ID || 'local'} `)
})