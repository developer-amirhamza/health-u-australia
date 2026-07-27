import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  experimental:{
    turbopackFileSystemCacheForDev:true,
  },
  images:{
    unoptimized:true,
  }
};

export default withNextVideo(nextConfig);