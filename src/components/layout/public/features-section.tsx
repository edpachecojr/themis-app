import { Heart, Shield, Zap } from "lucide-react";

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-100">
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-6 border border-primary-200">
        <Icon className="h-6 w-6 text-primary-600" />
      </div>
      <h3 className="text-xl font-bold text-neutral-800 mb-4">{title}</h3>
      <p className="text-neutral-600 leading-relaxed">{description}</p>
    </div>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Rápido e simples",
      description:
        "Configure sua plataforma em minutos e comece a gerenciar pacientes imediatamente.",
    },
    {
      icon: Heart,
      title: "Conexão direta",
      description:
        "Crie uma conexão mais próxima com seus pacientes através de prontuários personalizados.",
    },
    {
      icon: Shield,
      title: "Dados seguros",
      description:
        "Informações protegidas e conformidade total com regulamentações de saúde e LGPD.",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
