// import dotenv and call config function to load environment
require('dotenv').config();
const express = require('express');

const cors = require('cors');
const app = express();

const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // define client origin if both client and server have different origin
  },
});
require('./src/socket')(io);
// Get routes to the variabel
const router = require('./src/routes');

const port = 5000;

app.use(express.json());
// Add script use cors here ...
app.use(cors());
// Add endpoint grouping and router
app.use('/api/v1/', router);
app.use('/uploads', express.static('uploads'));
server.listen(port, () => console.log(`Listening on port ${port}!`));
