import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// vite.config.ts
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            imports: ['vue'],
            dirs: ['src/composables'],
            dts: true, // or a custom path
        }),
        Components({
            dts: true,
            dirs: ['src/components'],
            // valid file extensions for components.
            extensions: ['vue'],
        }),
        UnoCSS(),
    ],
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/lib-entry.ts'),
            name: 'V3FedMLChart',
            // the proper extensions will be added
            fileName: 'lib',
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue'],
            output: {
                exports: 'named',
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
})
