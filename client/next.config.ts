import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output:"export",
  images:{
    unoptimized:true,
  }
};

export default withNextVideo(nextConfig);