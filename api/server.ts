import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { createServer as createViteServer } from "vite";
import viteConfig from "../vite.config";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = express();
  const vite = await createViteServer({
    configFile: "vite.config.ts",
    server: { middlewareMode: true },
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res) => {
    res.status(200).send("Vite server running successfully on Vercel!");
  });

  app(req, res);
}

