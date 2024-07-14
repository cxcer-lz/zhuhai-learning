/** @type {import('next').NextConfig} */
const nextConfig = {
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