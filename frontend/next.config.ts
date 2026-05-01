import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { hostname } from "os";
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dkstatics-public.digikala.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'a.nooncdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.technolife.com',
        pathname: '/**',
      },
      {
        protocol:'https',
        hostname: 'www.digikala.com',
        pathname: '/**',
      }
    ],
  },
};

module.exports = nextConfig;