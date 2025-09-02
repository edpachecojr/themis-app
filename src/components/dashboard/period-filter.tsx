"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Calendar } from "lucide-react";

export type PeriodFilter = "today" | "week" | "month";

interface PeriodFilterProps {
  value: PeriodFilter;
  onValueChange: (value: PeriodFilter) => void;
}

export function PeriodFilter({ value, onValueChange }: PeriodFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Período
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Esta Semana</SelectItem>
            <SelectItem value="month">Este Mês</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
