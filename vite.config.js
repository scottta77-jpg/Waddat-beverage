import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'multi-page-routing',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url ? req.url.split('?')[0] : ''
          if (url === '/product/irish-moss-soursop' || url === '/product/irish-moss-soursop/') {
            _res.writeHead(301, { Location: '/product/Soursop-Sea-Moss/' })
            _res.end()
            return
          }
          if (url === '/product/soursop-sea-moss' || url === '/product/soursop-sea-moss/') {
            _res.writeHead(301, { Location: '/product/Soursop-Sea-Moss/' })
            _res.end()
            return
          }
          // If request is for a product page without trailing slash
          if (url.startsWith('/product/') && !url.endsWith('/') && !url.includes('.')) {
            req.url = `${url}/index.html`
          } else if (url === '/404') {
            req.url = '/404.html'
          }
          next()
        })
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        404: resolve(import.meta.dirname, '404.html'),
        'product-sorrel-drink': resolve(import.meta.dirname, 'product/sorrel-drink/index.html'),
        'product-soursop-sea-moss': resolve(import.meta.dirname, 'product/Soursop-Sea-Moss/index.html'),
        'product-irish-moss-soursop': resolve(import.meta.dirname, 'product/irish-moss-soursop/index.html'),
        'product-ginger-shot': resolve(import.meta.dirname, 'product/ginger-shot/index.html'),
        'product-irish-moss-pineapple': resolve(import.meta.dirname, 'product/irish-moss-pineapple/index.html'),
        'product-irish-moss-guava-banana': resolve(import.meta.dirname, 'product/irish-moss-guava-banana/index.html'),
      },
    },
  },
})
