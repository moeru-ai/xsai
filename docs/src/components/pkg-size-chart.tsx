'use client'

import type {
  ChartConfig,
} from '@/components/ui/chart'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartConfig = {
  bundled: {
    color: 'var(--chart-2)',
    label: 'Bundled size',
  },
  gzipped: {
    color: 'var(--chart-3)',
    label: 'Gzipped size',
  },
  installed: {
    color: 'var(--chart-1)',
    label: 'Installed size',
  },
} satisfies ChartConfig

interface PkgSizeData {
  bundled: number
  gzipped: number
  installed: number
  name: string
}

export const PkgSizeChart = ({ data }: { data: PkgSizeData[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Package size</CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="name"
            tickLine={false}
            tickMargin={10}
          />
          <ChartTooltip content={(
            <ChartTooltipContent
              formatter={(value, name) => (
                <>
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-xs"
                    style={{ backgroundColor: `var(--color-${name})` }}
                  />
                  <div className="flex min-w-[130px] items-center text-xs text-muted-foreground">
                    {chartConfig[name as keyof typeof chartConfig]?.label
                      || name}
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                      {value}
                      <span className="font-normal text-muted-foreground">
                        KB
                      </span>
                    </div>
                  </div>
                </>
              )}
              hideLabel
            />
          )}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="gzipped"
            fill="var(--color-gzipped)"
            radius={[0, 0, 4, 4]}
            stackId="a"
          />
          <Bar
            dataKey="bundled"
            fill="var(--color-bundled)"
            radius={[0, 0, 0, 0]}
            stackId="a"
          />
          <Bar
            dataKey="installed"
            fill="var(--color-installed)"
            radius={[4, 4, 0, 0]}
            stackId="a"
          />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
)
