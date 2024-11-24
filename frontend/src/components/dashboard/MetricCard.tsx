import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import type { StudyMetric } from '@/types/dashboard';

interface MetricCardProps {
  metric: StudyMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = metric.icon;
  
  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-500 
        ${isHovered ? 'shadow-xl scale-105' : 'shadow-md'}
        bg-gradient-to-br from-background to-background/50
        border border-primary/10 hover:border-primary/20`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium tracking-tight">
          {metric.label}
        </CardTitle>
        <Icon className={`h-5 w-5 transition-all duration-500 ${
          isHovered ? 'scale-110 text-primary' : 'text-muted-foreground'
        }`} />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold tracking-tight">{metric.value}</div>
          {metric.change && (
            <div className={`text-xs flex items-center gap-1 transition-colors duration-300 ${
              metric.trend === 'up' ? 'text-green-500' : 
              metric.trend === 'down' ? 'text-red-500' : 
              'text-muted-foreground'
            }`}>
              <TrendingUp className={`h-3 w-3 ${
                metric.trend === 'up' ? 'rotate-0' : 
                metric.trend === 'down' ? 'rotate-180' : ''
              }`} />
              {metric.change}
            </div>
          )}
          {metric.description && (
            <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {metric.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
