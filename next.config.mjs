/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Adiciona aqui o(s) domínio(s) de onde vieres a servir posters/backdrops
    // reais (ex: um bucket S3, Cloudinary, ou o próprio Mux para thumbnails),
    // caso substituas os placeholders gerados por imagens externas via
    // next/image no futuro. Por agora as artes de fallback são geradas em
    // SVG local, por isso isto não é obrigatório.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
    ],
  },
};

export default nextConfig;
