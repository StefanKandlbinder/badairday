import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.ts',
      injectRegister: 'script-defer',
      registerType: 'autoUpdate',
      manifest: {
        id: '/',
        name: 'To breathe, or not to breathe ...',
        short_name: 'BadAirDay',
        description: 'Weltweiter Echtzeit-Luft-Qualitätsindex basierend auf luftdaten.info und den offiziellen Messstellen für Oberösterreich',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        theme_color: '#00796b',
        background_color: '#ffffff',
        lang: 'de',
        icons: [
          {
            src: 'icons/android/android-launchericon-48-48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: 'icons/android/android-launchericon-72-72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: 'icons/android/android-launchericon-96-96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: 'icons/android/android-launchericon-144-144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'icons/android/android-launchericon-192-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/android/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/android/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'icons/ios/ios-appicon-152-152.png',
            sizes: '152x152',
            type: 'image/png',
          },
          {
            src: 'icons/ios/ios-appicon-180-180.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: 'icons/ios/ios-appicon-1024-1024.png',
            sizes: '1024x1024',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  server: {
    port: 3000,
  },
  css: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preprocessorOptions: { scss: { api: 'modern-compiler' } } as any,
  },
});
