import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  // 相对路径打包，方便部署到任意静态托管
  base: './',
  server: {
    // jump-jump 占用了 5173，固定另一个端口避免混淆
    port: 5174,
    host: true,
  },
});
