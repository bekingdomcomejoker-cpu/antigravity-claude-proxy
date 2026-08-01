#!/usr/bin/env node
import { startServer } from './server.js';
import { config } from './config.js';

const port = process.env.PORT || config.port || 8080;
startServer(port).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
