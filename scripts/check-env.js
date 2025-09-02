#!/usr/bin/env node

// Script para verificar se as variáveis de ambiente estão configuradas corretamente

const requiredEnvVars = [
  "DATABASE_URL",
  "NEXT_PUBLIC_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "AUTH_SECRET",
];

const optionalEnvVars = ["BETTER_AUTH_SESSION_TOKEN"];

console.log("🔍 Verificando variáveis de ambiente...\n");

let allConfigured = true;

requiredEnvVars.forEach((envVar) => {
  const value = process.env[envVar];
  if (value) {
    console.log(
      `✅ ${envVar}: ${
        envVar.includes("SECRET") || envVar.includes("PASSWORD")
          ? "***configurado***"
          : value
      }`
    );
  } else {
    console.log(`❌ ${envVar}: NÃO CONFIGURADO`);
    allConfigured = false;
  }
});

console.log("\n📋 Variáveis opcionais:");
optionalEnvVars.forEach((envVar) => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: ${value}`);
  } else {
    console.log(
      `ℹ️  ${envVar}: Não configurado (usando padrão: better-auth.session-token)`
    );
  }
});

console.log("\n" + "=".repeat(50));

if (allConfigured) {
  console.log("🎉 Todas as variáveis de ambiente estão configuradas!");

  // Verificar se a URL está configurada corretamente
  const url = process.env.NEXT_PUBLIC_URL;
  if (url && url.includes("localhost")) {
    console.log("⚠️  ATENÇÃO: NEXT_PUBLIC_URL está apontando para localhost");
    console.log("   Para produção, configure para sua URL da Vercel");
  } else if (url && url.includes("vercel.app")) {
    console.log("✅ NEXT_PUBLIC_URL está configurado para produção");
  }
} else {
  console.log("❌ Algumas variáveis de ambiente não estão configuradas");
  console.log("   Consulte o arquivo OAUTH_SETUP.md para instruções");
}

console.log(
  "\n📋 URLs de redirecionamento necessárias no Google Cloud Console:"
);
const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
console.log(`   - ${baseUrl}/api/auth/callback/google`);
