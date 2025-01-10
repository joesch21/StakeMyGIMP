/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "ipfs.io",
          pathname: "/ipfs/**",
        },
        {
          protocol: "https",
          hostname: "gateway.ipfscdn.io",
          pathname: "/ipfs/**",
        },
        {
          protocol: "https",
          hostname: "d391b93f5f62d9c15f67142e43841acc.ipfscdn.io",
          pathname: "/ipfs/**",
        },
      ],
    },
    productionBrowserSourceMaps: false, // Disable production source maps
  };
  
  export default nextConfig;
  