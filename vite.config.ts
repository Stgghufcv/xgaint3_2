import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/xgaint3_2/', // 确保这里和你的仓库名一模一样，前后都有斜杠
})