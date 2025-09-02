import { AuthLayout } from "@/components/layout/public";

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
