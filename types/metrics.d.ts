export type Metric = {
  value: string;
  change: number;
  frequency?: string;
};

export type MetricChartConfig = {
  [key: string]: {
    label: string;
    color?: string;
  };
};

export type MetricChartProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  data: any;
  config: MetricChartConfig;
};
