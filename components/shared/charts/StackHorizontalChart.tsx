import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarConfig } from "@/types/charts";
import { MetricChartProps } from "@/types/metrics";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

type Props = MetricChartProps & {
  bars: BarConfig[];
};

const StackHorizontalChart = ({ data, config, bars }: Props) => {
  return (
    <ChartContainer config={config} className="max-h-[50rem] w-full">
      <BarChart data={data} layout="vertical" barSize={30}>
        <ChartLegend content={<ChartLegendContent />} />
        <XAxis type="number" hide />
        <YAxis
          dataKey="category"
          type="category"
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          hide
        />
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            stackId="a"
            fill={bar.fill}
            radius={bar.radius}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
};

export default StackHorizontalChart;
