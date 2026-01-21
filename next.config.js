const withSerwist = require("@serwist/next").default({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Permitir imagens do Participa DF
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.participa.df.gov.br",
        pathname: "/assets/**",
      },
    ],
  },
};

module.exports = withSerwist(nextConfig);
