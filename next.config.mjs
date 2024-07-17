/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  }
};

// export default nextConfig;


export default {
    // reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'ipfs.io',
          port: '',
        },
      ],
    },
  };