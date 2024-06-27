const express = require('express');
const redis = require('redis');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = 8080;

const client = redis.createClient({
    password: 'UGlQH4JFh2M0XyHe103jU0gcTKfHbL3T',
    socket: {
        host: 'redis-19032.c60.us-west-1-2.ec2.redns.redis-cloud.com',
        port: 19032
    }
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

// Middlewares
app.use(cookieParser());
app.use(cors());

function generateGuestId() {
    return `guest-${Math.random().toString(36).substr(2, 9)}`;
}

async function isGuest(userId) {
    return client.sIsMember('guest-users', userId);
}

async function assignLayout(userId) {
    const layouts = ['layout1', 'layout2', 'layout3'];
    const randomIndex = Math.floor(Math.random() * layouts.length);
    const layout = layouts[randomIndex];

    await client.hSet('user-layouts', userId, layout);
    return layout;
}

async function serveLayout(req, res) {
    const userId = req.cookies.userId || generateGuestId(0);
    const isGuestUser = await isGuest(userId);

    if(isGuestUser) {
        await client.sAdd('guest-users', userId);
    }

    let layout = await client.hGet('user-layouts', userId);

    if(!layout) {
        layout = await assignLayout(userId);
    }

    res.cookie('userId', userId);

    res.send(`layouts - ${layout}, user - ${userId}`);
}

// @Get /
app.get('/', serveLayout);

app.listen(port, () => console.log(`Server started at port ${port}`));