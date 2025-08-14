// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: ",
              "connect-src 'self' https://plausible.io",
              "frame-ancestors 'self'",
            ].join('; ')
          }
        ]
      }
    ];
  }
};
module.exports = nextConfig;
