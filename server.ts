import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory store for demo purposes
  const trackingData: any[] = [];
  let whatsappConfig = {
    phoneNumber: "+2348103612710",
    message: "Hello TOSJESS Investment Limited, I want to apply for a loan.",
    floatingEnabled: true
  };

  // Tracking API Endpoint
  app.post('/api/track/whatsapp', (req, res) => {
    const { source, device, timestamp } = req.body;
    trackingData.push({ source, device, timestamp });
    console.log('WhatsApp click tracked:', { source, device, timestamp });
    res.json({ success: true });
  });

  // Admin API Endpoints
  app.get('/api/admin/whatsapp/stats', (req, res) => {
    res.json({ trackingData, config: whatsappConfig });
  });

  app.post('/api/admin/whatsapp/config', (req, res) => {
    whatsappConfig = { ...whatsappConfig, ...req.body };
    res.json({ success: true, config: whatsappConfig });
  });

  app.post('/api/admin/whatsapp/clear', (req, res) => {
    trackingData.length = 0;
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
