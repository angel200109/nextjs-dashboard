"use server"; // 这是 server action

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { z } from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({ message: "请选择一个客户名称" }),
  amount: z.coerce.number().gt(0, {
    message: "请输入大于0的数字.",
  }),
  status: z.enum(["pending", "paid"], {
    message: "请选择一个状态",
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

// 错误信息类型
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// 新增 invoice
export async function createInvoice(prevState: State, formData: FormData) {
  // prevState就是前一次的结果（已验证）
  // throw new Error("Failed to Add Invoice");

  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "创建发票失败",
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // We'll log the error to the console for now
    return { message: "Database Error:insert fail" };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

// 修改 invoice
export async function updateInvoice(id: string, formData: FormData) {
  const UpdateInvoice = FormSchema.omit({ id: true, date: true });
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

// 删除 invoice
export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}

// 用户登录
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData); // 特指 账号-密码 登录的方式
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
