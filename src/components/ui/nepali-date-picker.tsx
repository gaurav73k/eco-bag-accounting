
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFiscalYear } from "@/contexts/FiscalYearContext";

interface NepaliDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  fiscalYearRestricted?: boolean;
}

export function NepaliDatePicker({
  value,
  onChange,
  className,
  placeholder = "Select date",
  disabled = false,
  fiscalYearRestricted = true,
}: NepaliDatePickerProps) {
  const { fiscalYearData } = useFiscalYear();
  
  // Format the date for display
  const displayValue = value ? format(value, "PPP") : undefined;
  
  // Calculate fiscal year date range if available
  const fromDate = fiscalYearData?.start_date ? new Date(fiscalYearData.start_date) : undefined;
  const toDate = fiscalYearData?.end_date ? new Date(fiscalYearData.end_date) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue || <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          disabled={fiscalYearRestricted && fromDate && toDate ? 
            (date) => date < fromDate || date > toDate : undefined}
          fromDate={fiscalYearRestricted ? fromDate : undefined}
          toDate={fiscalYearRestricted ? toDate : undefined}
        />
        {fiscalYearData && fiscalYearRestricted && (
          <div className="p-2 text-xs text-center border-t border-border">
            Fiscal Year: {fiscalYearData.name}
            <div className="text-muted-foreground">
              {fromDate && toDate ? `${format(fromDate, "MMM d, yyyy")} - ${format(toDate, "MMM d, yyyy")}` : "No date range set"}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default NepaliDatePicker;
