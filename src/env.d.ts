interface ImportMetaEnv {
  // Cloudflare Web Analytics site token. Unset in dev and in builds without analytics.
  readonly PUBLIC_CF_BEACON_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
