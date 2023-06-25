const { defineConfig } = require('@vue/cli-service')

const fs = require('fs')

module.exports = defineConfig({

  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: {
      key: fs.readFileSync('./certs/vueCertificate+5-key.pem'),
      cert: fs.readFileSync('./certs/vueCertificate+5.pem'),
    }
  },

  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/scss/_variables.scss";
        `
      }
    }
  },
  configureWebpack: {
    resolve: {
      fallback: {
        "crypto": require.resolve("crypto-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "https": require.resolve("https-browserify"),
        "http": require.resolve("stream-http"),
        "stream": require.resolve("stream-browserify")
      }
    }
  }
})