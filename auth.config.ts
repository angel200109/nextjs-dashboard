// 授权验证（验证登录没有）
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login", // 验证失败，返回这个路由
  },
  callbacks: {
    // 页面切换会调用
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user; // 转布尔类型
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        // 跳转到/dashboard的子页面
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl)); // 成功跳转
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} as NextAuthConfig;
