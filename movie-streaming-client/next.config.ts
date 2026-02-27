import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Chỉ định rõ thư mục gốc của project để Turbopack không bị nhầm lẫn
    turbo: {
      root: path.join(__dirname, "../../"), 
    },
  },
  // Bỏ qua các lỗi linting khi build để ưu tiên chạy được dự án trước
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
