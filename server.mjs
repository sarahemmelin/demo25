'use strict';

import express from 'express';
import path from 'path';
import deckRoutes from './routes/deckRoutes.mjs';
import poetryRoutes from './routes/poetryRoutes.mjs';

const server = express();
const port = process.env.PORT || 3000;

server.set('port', port);
server.use(express.static('public/DeckOfCards'));
server.use(express.json());

server.get("/", (req, res) => {
    res.sendFile(path.resolve('public/DeckOfCards/index.html'));
});

server.use('/temp', deckRoutes);
server.use('/tmp', poetryRoutes);

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
