import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/profile',
        destination: 'http://localhost:5000/api/profile',
      },
      {
        source: '/api/profile/:path*',
        destination: 'http://localhost:5000/api/profile/:path*',
      },
      {
        source: '/api/skills',
        destination: 'http://localhost:5000/api/skills',
      },
      {
        source: '/api/skills/:path*',
        destination: 'http://localhost:5000/api/skills/:path*',
      },
      {
        source: '/api/projects',
        destination: 'http://localhost:5000/api/projects',
      },
      {
        source: '/api/projects/:path*',
        destination: 'http://localhost:5000/api/projects/:path*',
      },
      {
        source: '/api/upload',
        destination: 'http://localhost:5000/api/upload',
      },
      {
        source: '/api/upload/:path*',
        destination: 'http://localhost:5000/api/upload/:path*',
      },
      {
        source: '/api/contact',
        destination: 'http://localhost:5000/api/contact',
      },
      {
        source: '/api/contact/:path*',
        destination: 'http://localhost:5000/api/contact/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5000/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
