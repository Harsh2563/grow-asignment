"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { type ChartDataPoint } from "@/lib/chart-data-service";

interface VolumeChartProps {
  data: ChartDataPoint[];
  height?: number;
}

export const VolumeChart: React.FC<VolumeChartProps> = ({
  data,
  height = 100,
}) => {
  // Filter out data points without volume
  const volumeData = data.filter((point) => point.volume && point.volume > 0);

  if (volumeData.length === 0) {
    return null;
  }

  // Custom tooltip for volume
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      const volume = payload[0].value;
      return (
        <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-blue-600">
            Volume: {volume?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
        <span className="text-sm font-medium text-muted-foreground">
          Volume
        </span>
      </div>
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={volumeData}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(1)}K`;
                }
                return value.toString();
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="volume"
              fill="#3b82f6"
              opacity={0.6}
              radius={[1, 1, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
