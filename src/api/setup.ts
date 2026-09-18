// src/api/setup.ts
import { client } from "./generated/requests/client.gen";

client.setConfig({
  baseUrl: "http://localhost:8080",
  credentials: "include", // critical — sends cookies cross-origin
});