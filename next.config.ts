import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      { source: '/dashboard', destination: '/tablero', permanent: true },
      { source: '/dashboard/:path*', destination: '/tablero/:path*', permanent: true },
      { source: '/equipment', destination: '/mantenimiento/equipos', permanent: true },
      { source: '/equipment/:path*', destination: '/mantenimiento/equipos/:path*', permanent: true },
      { source: '/equipos', destination: '/mantenimiento/equipos', permanent: true },
      { source: '/equipos/:path*', destination: '/mantenimiento/equipos/:path*', permanent: true },
      { source: '/alarms', destination: '/alarmas', permanent: true },
      { source: '/alarms/:path*', destination: '/alarmas/:path*', permanent: true },
      { source: '/users', destination: '/usuarios', permanent: true },
      { source: '/users/:path*', destination: '/usuarios/:path*', permanent: true },
      { source: '/plans', destination: '/planes', permanent: true },
      { source: '/reports', destination: '/reportes', permanent: true },
      { source: '/interventions', destination: '/mantenimiento/intervenciones', permanent: true },
      { source: '/interventions/:path*', destination: '/mantenimiento/intervenciones/:path*', permanent: true },
      { source: '/intervenciones', destination: '/mantenimiento/intervenciones', permanent: true },
      { source: '/intervenciones/:path*', destination: '/mantenimiento/intervenciones/:path*', permanent: true },
      { source: '/public/intervencion/:path*', destination: '/intervencion/:path*', permanent: true },
      { source: '/public/service/:path*', destination: '/service/:path*', permanent: true },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Forcing a server restart to clear HMR issues. This is a simple trick to fix module resolution problems.
};

export default nextConfig;
