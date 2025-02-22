// eslint-disable-next-line @masknet/no-top-level
'use client'

import type {
  ChartConfig,
} from '@/components/ui/chart'

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
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

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
      <CardTitle>Package size (KB)</CardTitle>
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
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
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
