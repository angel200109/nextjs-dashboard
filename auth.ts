import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";
import postgres from "postgres";

// 查数据库
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error("获取用户信息失败:", error);
    throw new Error("获取用户信息失败");
  }
}

// 使用 NextAuth 模块，得到授权、登录、退出的函数
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    // Credentials 代表 账号-密码 的方式
    Credentials({
      async authorize(credentials) {
        // 先验证 credentials 表单数据，
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        // 若验证规则成功
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user; // 账号-密码 成功
        }
        console.log("用户验证失败");
        return null;
      },
    }),
  ],
});
