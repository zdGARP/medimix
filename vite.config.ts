import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// @ts-ignore
import { processMedicineImagesWithGemini, translateTextWithGemini } from './server/geminiHandler.js';


function apiServerPlugin() {
  return {
    name: 'api-server-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url === '/api/analyze-medicine' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body || '{}');
              const result = await processMedicineImagesWithGemini(payload.images || []);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = result.success ? 200 : 500;
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'BAD_REQUEST', message: err.message }));
            }
          });
          return;
        } else if (req.url === '/api/translate' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body || '{}');
              const result = await translateTextWithGemini(payload.text, payload.targetLanguage);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = result.success ? 200 : 500;
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'BAD_REQUEST', message: err.message }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiServerPlugin()],
});
