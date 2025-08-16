"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Form, Input, Button, Card, message } from "antd";
import { useEmailAuth } from "@/services/hooks/useEmailAuth";
import Link from "next/link";

function SignUp() {
  const t = useTranslations("signUpPage");
  const { signUpWithEmail } = useEmailAuth();
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSignup = async (values: { email: string; password: string }) => {
    setLoading(true);
    const { user, error } = await signUpWithEmail(
      values.email,
      values.password
    );
    setLoading(false);

    if (error) {
      message.error(error.message || "Signup failed");
    } else {
      message.success(
        `Account created for ${user?.email}. Please check your email to confirm.`
      );
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 1200);
    }
  };

  return (
    <div className="flex max-w-2xl w-full lg:w-2xl items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md rounded-2xl !py-10 !px-8 shadow-lg">
        <h1 className="text-2xl text-center font-bold mb-2">{t("title")}</h1>
        <p className="mb-6 font-medium opacity-80 text-center">
          {t("description")}
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSignup}
          className="space-y-4"
        >
          <Form.Item
            label={<span className="font-medium">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter your email"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium">Password</span>}
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Enter your password"
              className="rounded-lg"
            />
          </Form.Item>

          <div className="flex gap-3 pt-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="flex-1 rounded-lg"
            >
              {t("button")}
            </Button>
          </div>

          <div className="text-xs text-center pt-2">
            <span className="opacity-65">{t("paragraph.left")}</span>{" "}
            <Link href={`/${locale}/login`} className="hover:underline">
              {t("paragraph.right")}
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default SignUp;
