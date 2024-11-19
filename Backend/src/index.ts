import app from './app';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from 'http';

const server = createServer((req, res) => app(req as any, res as any));

export default (req: VercelRequest, res: VercelResponse) => {
  server.emit('request', req, res);
};
