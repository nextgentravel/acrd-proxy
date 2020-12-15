require('dotenv').config()

const express = require('express');
const basicAuth = require('express-basic-auth')
const app = express();

const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

// Configuration
const PORT = process.env.PORT || 8080;
const HOST = "localhost";
const API_SERVICE_URL = process.env.API_SERVICE_URL;

// Logging
app.use(morgan('dev'));

// Info GET endpoint
app.get('/info', (req, res, next) => {
    res.send('This is a proxy service which proxies the Interop API and our Azure VM.');
});

app.use(basicAuth({
    users: { 'username': process.env.SUPER_SECURE_PASSWORD }
}))

// Proxy endpoints
app.use('/api', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/api`]: '',
    },
}));

app.listen(PORT, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});