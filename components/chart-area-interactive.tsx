"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const generateVisitorData = (days: number) => {
  const data = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = date.toISOString().split("T")[0];

    const desktop = Math.floor(Math.random() * 500) + 50;
    let mobile = Math.floor(Math.random() * desktop);

    if (mobile < 100) {
      mobile = 100 + Math.floor(Math.random() * 100);
    }

    if (mobile > desktop) {
      mobile = desktop;
    }

    data.push({
      date: formattedDate,
      desktop,
      mobile,
    });
  }
  return data;
};

const getXTicks = (data: any[], range: string) => {
  if (!data.length) return [];

  const count = range === "30d" ? 10 : range === "7d" ? 7 : 15;
  const step = Math.floor(data.length / (count - 1));
  const seen = new Set<string>();
  const ticks: string[] = [];

  for (let i = 0; i < count; i++) {
    const index = Math.min(i * step, data.length - 1);
    const dateStr = data[index].date;

    if (!seen.has(dateStr)) {
      ticks.push(dateStr);
      seen.add(dateStr);
    }
  }

  const startDate = data[0].date;
  const endDate = data[data.length - 1].date;

  if (!seen.has(startDate)) ticks.unshift(startDate);
  if (!seen.has(endDate)) ticks.push(endDate);

  return ticks;
};

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d");
  const [chartData, setChartData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const updateData = () => {
      const newData = generateVisitorData(days);
      setChartData(newData);
    };
    updateData();

    const interval = setInterval(updateData, 10000);
    return () => clearInterval(interval);
  }, [timeRange]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visitor Analytics</CardTitle>
          <CardDescription>Loading visitor data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="pt-0">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 space-y-0 border-b py-5">
        <div className="grid flex-1 gap-1">
          <CardTitle>Visitor Analytics</CardTitle>
          <CardDescription>
            Showing total visitors for the last{" "}
            {timeRange === "90d"
              ? "3 months"
              : timeRange === "30d"
              ? "30 days"
              : "7 days"}{" "}
            (updates every 10s)
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
          aria-label="Select time range"
        >
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] max-h-[300px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={0}
              interval="preserveStartEnd"
              type="category"
              domain={[
                chartData[0]?.date,
                chartData[chartData.length - 1]?.date,
              ]}
              ticks={getXTicks(chartData, timeRange)}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric", });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : Math.max(10, Math.floor(Math.random() * (chartData.length)))}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              strokeWidth="0"

            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              strokeWidth="0"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}