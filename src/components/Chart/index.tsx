import { useMemo } from "react";
import { format } from "date-fns";
import { Stack, Typography } from "@mui/material";
import { AreaChart, XAxis, YAxis, Tooltip, Area } from "recharts";
import { HistoryPoint } from "@/commonTypes";

export type ChartProps = {
  data: HistoryPoint[];
  isGrowth: boolean;
  dayTime?: boolean;
};

const Chart = ({ data, isGrowth, dayTime = false }: ChartProps) => {
  const chartColor = isGrowth ? "#75d371" : "#eb5023";

  const tooltipContent = useMemo<{
    [key: number]: { price: string; date: string; dateFormatDay: string };
  }>(
    () =>
      data.reduce(
        (content, current) => ({
          ...content,
          [current.time]: {
            price: Number(current.priceUsd.toFixed(2)).toLocaleString(),
            date: format(new Date(current.date), "d MMM y"),
            dateFormatDay: format(new Date(current.date), "d MMM y hh:mm a")
          }
        }),
        {}
      ),
    [data]
  );

  return (
    <AreaChart width={window.innerWidth * 0.56} height={170} data={data}>
      <defs>
        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="20%" stopColor={chartColor} stopOpacity={0.8} />
          <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis dataKey="time" tick={false} tickLine={false} />
      <YAxis
        tickFormatter={(price) => {
          if (price) {
            return Math.trunc(price).toLocaleString();
          }
          return "--";
        }}
        tick={{ fontFamily: "sans-serif" }}
        type="number"
        domain={["dataMin", "dataMax"]}
        minTickGap={10}
      />
      <Tooltip
        active={window.innerWidth > 900}
        content={({ payload }) => {
          const [currentPayload] = payload || [];
          if (currentPayload?.payload) {
            const { time } = currentPayload.payload as { time: number };
            return (
              <Stack>
                <Typography>{tooltipContent[time].price}</Typography>
                <Typography>
                  {dayTime
                    ? tooltipContent[time].dateFormatDay
                    : tooltipContent[time].date}
                </Typography>
              </Stack>
            );
          }
        }}
      />
      <Area
        type="monotone"
        dataKey="priceUsd"
        stroke={chartColor}
        strokeWidth={3}
        fillOpacity={1}
        fill="url(#colorPrice)"
      />
    </AreaChart>
  );
};

export default Chart;
