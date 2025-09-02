"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { Input } from "@/components/input";

type DatePickerProps = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
};

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState(
    value ? format(value, "dd/MM/yyyy") : ""
  );

  // Digitação manual
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const parsed = parse(val, "dd/MM/yyyy", new Date());
    if (!isNaN(parsed.getTime())) {
      onChange(parsed);
    }
  };

  // Seleção pelo calendário
  const handleSelectDate = (selected: Date | undefined) => {
    onChange(selected);
    if (selected) {
      setInputValue(format(selected, "dd/MM/yyyy"));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[260px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "dd/MM/yyyy") : "Selecione uma data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelectDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Input manual */}
      <Input
        placeholder="dd/mm/aaaa"
        value={inputValue}
        onChange={handleInputChange}
        className="w-[160px]"
      />
    </div>
  );
}
