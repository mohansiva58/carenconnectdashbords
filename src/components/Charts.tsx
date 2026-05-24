import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const colors = ["#4F46E5", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-5.5 shadow-xs">
    <h3 className="mb-4 text-sm font-bold text-slate-800 tracking-tight">{title}</h3>
    <div className="h-64">{children}</div>
  </div>
);

// Custom Tooltip component for highly professional charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xl leading-none">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{entry.name}:</span>
              <span className="text-xs font-black text-slate-850">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const TrendChart = ({ data, title = "Leads & Complaints Trend" }: { data: any[]; title?: string }) => (
  <Card title={title}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={8} />
        <YAxis stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dx={-8} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#E2E8F0", strokeWidth: 1, strokeDasharray: "4 4" }} />
        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}
        />
        <Line type="monotone" name="Leads" dataKey="leads" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6 }} />
        <Line type="monotone" name="Complaints" dataKey="complaints" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

export const RegionBarChart = ({ data, title = "Leads by Region" }: { data: any[]; title?: string }) => (
  <Card title={title}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={8} />
        <YAxis stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dx={-8} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
        <Bar dataKey="value" name="Leads" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={28} />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

export const AttendanceTrendChart = ({ data, title = "Attendance Trend" }: { data: any[]; title?: string }) => (
  <Card title={title}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={8} />
        <YAxis stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dx={-8} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#E2E8F0", strokeWidth: 1, strokeDasharray: "4 4" }} />
        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}
        />
        <Line type="monotone" name="Present" dataKey="present" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6 }} />
        <Line type="monotone" name="Absent" dataKey="absent" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

export const DistroPieChart = ({ data, title = "Role / Team Distribution" }: { data: any[]; title?: string }) => (
  <Card title={title}>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} stroke="#fff" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={6}
          wrapperStyle={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}
        />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);
