// app/registry.ts
import { BlockPlugin } from "./types";
import { PluginImagem } from "../components/BlocoImagem";
// Importe os outros plugins aqui conforme for convertendo
// import { PluginTexto } from "../components/BlocoTexto";
// import { PluginTabelaCDU } from "../components/TabelaCDU";

// Mapa de Plugins: 'tipo' -> Objeto Plugin
export const BLOCK_REGISTRY: Record<string, BlockPlugin> = {
  // [PluginTexto.type]: PluginTexto,
  // [PluginTabelaCDU.type]: PluginTabelaCDU,
  [PluginImagem.type]: PluginImagem,
};

// Helper para pegar lista de botões
export const getPlugins = () => Object.values(BLOCK_REGISTRY);

// Helper para pegar um plugin específico
export const getPlugin = (type: string) => BLOCK_REGISTRY[type];