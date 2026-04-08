import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: React.ReactNode;
  tooltipText?: string;
}

export function MetricCard({ title, value, icon, description, tooltipText }: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-500 
        ${isHovered ? 'shadow-xl scale-105' : 'shadow-md'}
        bg-gradient-to-br from-background to-background/50
        border border-primary/10 hover:border-primary/20`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={tooltipText}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium tracking-tight">
          {title}
        </CardTitle>
        <div className={`transition-all duration-500 ${
          isHovered ? 'scale-110 text-primary' : 'text-muted-foreground'
        }`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          {description && (
            <div className="text-xs">
              {description}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
