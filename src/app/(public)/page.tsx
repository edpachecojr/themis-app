import { HeroSection, FeaturesSection } from "@/components/layout/public";
import { PageLayout } from "./page-layout";

export default function Home() {
  return (
    <PageLayout>
      <HeroSection />
      <FeaturesSection />
    </PageLayout>
  );
}
