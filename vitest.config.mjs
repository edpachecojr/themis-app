import { defineConfig } from "vite";
import path from "path";

// NOTA: O warning "CJS build of Vite's Node API is deprecated" é conhecido
// na versão atual do Vitest (2.1.x) e não afeta o funcionamento dos testes.
// Será resolvido em futuras versões do Vitest/Vite.

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./__tests__/setup.ts"],
    css: true,
    // Suprimir logs durante os testes
    silent: true,
    // Configurações adicionais para reduzir output
    reporters: ["default"],
    // Suprimir console.log e console.error durante os testes
    setupFilesAfterEnv: ["./__tests__/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
});
