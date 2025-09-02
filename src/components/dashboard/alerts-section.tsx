"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { AlertTriangle, Clock, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: "warning" | "info" | "error";
  contactId?: string;
  appointmentId?: string;
  time?: string;
}

interface AlertsSectionProps {
  alerts: Alert[];
}

export function AlertsSection({ alerts }: AlertsSectionProps) {
  const router = useRouter();

  if (alerts.length === 0) {
    return null;
  }

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Clock className="h-4 w-4" />;
    }
  };

  const getAlertBadgeVariant = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return "destructive" as const;
      case "warning":
        return "default" as const;
      case "info":
        return "secondary" as const;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alertas
          <Badge variant="secondary" className="ml-auto">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getAlertIcon(alert.type)}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{alert.title}</h4>
                    <Badge variant={getAlertBadgeVariant(alert.type)}>
                      {alert.type === "error"
                        ? "Erro"
                        : alert.type === "warning"
                        ? "Aviso"
                        : "Info"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alert.description}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {alert.contactId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/contacts/${alert.contactId}`)}
                  >
                    Ver Contato
                  </Button>
                )}
                {alert.appointmentId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/appointments/${alert.appointmentId}`)
                    }
                  >
                    Ver Agendamento
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
