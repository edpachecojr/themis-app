import { AuthLayout } from "@/components/layout/public";

export default function CreatePasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
