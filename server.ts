import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory state for settings and live cache
let adSettings = {
  simulatedAds: true,
  offerwallUrl: '',
  coppaSafeKidsMode: true,
  rewardVideoDuration: 7,
};

const lastSyncTimestamp = new Date().toISOString();

// ----------------- API ROUTES -----------------
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    community: 'COMUNIDAD OLVIS BOLT',
    time: new Date().toISOString(),
  });
});

// Live check & news refresh status
app.get('/api/news/status', (req: Request, res: Response) => {
  res.json({
    lastSync: lastSyncTimestamp,
    mode: 'official-community',
  });
});

app.post('/api/news/refresh', (req: Request, res: Response) => {
  res.json({
    message: 'Fuentes sincronizadas con éxito',
    lastSync: new Date().toISOString(),
    status: 'updated',
  });
});

// Ad Settings for Olvis Bolt
app.get('/api/settings/ads', (req: Request, res: Response) => {
  res.json(adSettings);
});

app.post('/api/settings/ads', (req: Request, res: Response) => {
  const newConfig = req.body;
  adSettings = {
    ...adSettings,
    ...newConfig,
  };
  res.json({
    success: true,
    message: 'Configuración de anuncios guardada correctamente',
    settings: adSettings,
  });
});

// ----------------- VITE SETUP -----------------
async function startServer() {
  const distPath = path.join(process.cwd(), 'dist');
  const indexHtmlExists = fs.existsSync(path.join(distPath, 'index.html'));

  if (process.env.NODE_ENV === 'production' && indexHtmlExists) {
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Development or fallback mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ Comunidad Olvis Bolt Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
