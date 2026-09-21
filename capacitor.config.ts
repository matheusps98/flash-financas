import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'br.com.flash.financas', appName: 'Flash Finanças', webDir: 'dist',
  android: { allowMixedContent: false },
  plugins: { SplashScreen: { launchShowDuration: 0 } }
};
export default config;
