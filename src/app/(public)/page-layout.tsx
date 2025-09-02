import { PublicLayout } from "@/components/layout/public";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return <PublicLayout>{children}</PublicLayout>;
}
