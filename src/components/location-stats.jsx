
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function Location({stats}) {
    const cityCount = stats.reduce((acc, item) => {
        if(acc[item.city]) {
            acc[item.city] +=1;
        } else acc[item.city] =1;

       return acc;

    })

    const cities = Object.entries((cityCount).map(([city, count]) => ({
        city,
        count,
    })))

  return (
    <ResponsiveContainer>
    <LineChart width={700} height={300} data={cities}>
      <XAxis dataKey="cities" />
      <YAxis />
      <Tooltip labelStyle={{clolr: "green"}}/>
      <Legend />
      <Line
        type="monotone"
        dataKey="count"
        stroke="#8884d8"
        // activeDot={{ r: 8 }}
      />
      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
    </LineChart>
    </ResponsiveContainer>
  );
}
