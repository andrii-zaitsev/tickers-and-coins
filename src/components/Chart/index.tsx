import { format } from "date-fns";
import { Stack, Typography } from "@mui/material";
import { AreaChart, XAxis, YAxis, Tooltip, Area } from "recharts";
import { HistoryPoint } from "@/commonTypes/tickers";

export type ChartProps = {
  data: HistoryPoint[];
  dayTime?: boolean;
};

const Chart = ({ data, dayTime = false }: ChartProps) => {
  const isRed = data[0].priceUsd > data[data.length - 1].priceUsd;
  const red = "#eb5023";
  const green = "#75d371";
  const chartColor = isRed ? red : green;

  const tooltipContent = data.reduce(
    (content, current) => ({
      ...content,
      [current.time]: {
        price: Number(current.priceUsd).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2
        }),
        date: format(new Date(current.date), "d MMM y"),
        dateFormatDay: format(new Date(current.date), "d MMM y hh:m a")
      }
    }),
    {}
  );

  return (
    <AreaChart width={window.innerWidth * 0.56} height={170} data={data}>
      <defs>
        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="20%" stopColor={chartColor} stopOpacity={0.8} />
          <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis dataKey="time" />
      <YAxis type="number" domain={["dataMin", "dataMax"]} minTickGap={10} />
      <Tooltip
        active={window.innerWidth > 900}
        // itemStyle={{ display: "none" }}
        content={({ payload }) => {
          const [currentPayload] = payload;
          if (currentPayload?.payload) {
            const { time } = currentPayload.payload;
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
