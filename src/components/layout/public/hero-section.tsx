import { Button } from "@/components/button";
import { Badge } from "@/components/badge";

export function HeroSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <Badge className="mb-6 bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 border-primary-200 px-4 py-2 rounded-full text-sm font-medium">
          🚀 Sistema de Gestão para Profissionais de Saúde
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
          Gerencie seus{" "}
          <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
            pacientes
          </span>{" "}
          com eficiência
        </h1>
        <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
          Plataforma completa para profissionais de saúde gerenciarem
          prontuários, agendamentos e comunicação com pacientes de forma simples
          e segura.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Começar Agora
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary-200 text-primary-700 hover:bg-primary-50 hover:text-primary-800 hover:border-primary-300"
          >
            Saiba Mais
          </Button>
        </div>
      </div>
    </section>
  );
}
