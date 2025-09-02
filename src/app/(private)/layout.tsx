import { AppLayout } from "@/components/layout/app-layout";
import { auth } from "@/lib/authentication/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return <AppLayout>{children}</AppLayout>;
}
