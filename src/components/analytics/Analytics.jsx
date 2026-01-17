import { useState } from 'react';
import { Download, Calendar, TrendingUp, Users, School, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';
import { Button } from '../ui/button.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.jsx';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('6months');

  const revenueData = [
    { month: 'May', revenue: 48000, expenses: 32000, profit: 16000 },
    { month: 'Jun', revenue: 52000, expenses: 35000, profit: 17000 },
    { month: 'Jul', revenue: 58000, expenses: 38000, profit: 20000 },
    { month: 'Aug', revenue: 65000, expenses: 42000, profit: 23000 },
    { month: 'Sep', revenue: 72000, expenses: 45000, profit: 27000 },
    { month: 'Oct', revenue: 78000, expenses: 48000, profit: 30000 },
  ];

  const userGrowthData = [
    { month: 'May', students: 18500, teachers: 1200, parents: 16800 },
    { month: 'Jun', students: 19200, teachers: 1250, parents: 17500 },
    { month: 'Jul', students: 20100, teachers: 1320, parents: 18200 },
    { month: 'Aug', students: 21400, teachers: 1380, parents: 19100 },
    { month: 'Sep', students: 23200, teachers: 1450, parents: 20500 },
    { month: 'Oct', students: 24800, teachers: 1520, parents: 21800 },
  ];

  const schoolTypeData = [
    { name: 'Public', value: 520, color: '#2563EB' },
    { name: 'Private', value: 412, color: '#16A34A' },
    { name: 'International', value: 234, color: '#9333EA' },
    { name: 'Charter', value: 118, color: '#EA580C' },
  ];

  const vendorPerformanceData = [
    { category: 'Books', orders: 1240, revenue: 62000, rating: 4.5 },
    { category: 'Tech', orders: 980, revenue: 128000, rating: 4.7 },
    { category: 'Food', orders: 1580, revenue: 94000, rating: 4.3 },
    { category: 'Transport', orders: 720, revenue: 86000, rating: 4.6 },
    { category: 'Uniforms', orders: 850, revenue: 45000, rating: 4.4 },
  ];

  const regionalData = [
    { region: 'North', schools: 285, users: 6500, growth: 12.5 },
    { region: 'South', schools: 342, users: 7800, growth: 15.2 },
    { region: 'East', schools: 398, users: 9200, growth: 18.7 },
    { region: 'West', schools: 259, users: 5000, growth: 9.8 },
  ];

  const handleExport = (format) => {
    try {
      if (format === 'pdf') {
        // Generate HTML for PDF
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Analytics Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
              h1 { color: #2563EB; margin-bottom: 10px; }
              .meta { color: #64748b; font-size: 14px; margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
              th { background-color: #2563EB; color: white; font-weight: 600; }
              tr:nth-child(even) { background-color: #f8fafc; }
              .section { margin: 30px 0; }
              .section-title { font-size: 18px; font-weight: 600; color: #1e293b; margin: 20px 0 10px 0; }
            </style>
          </head>
          <body>
            <h1>Analytics & Reports</h1>
            <p class="meta">Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            
            <div class="section">
              <div class="section-title">Revenue Analysis (Last 6 Months)</div>
              <table>
                <thead><tr><th>Month</th><th>Revenue</th><th>Expenses</th><th>Profit</th></tr></thead>
                <tbody>
                  ${revenueData.map(item => `<tr><td>${item.month}</td><td>$${item.revenue.toLocaleString()}</td><td>$${item.expenses.toLocaleString()}</td><td>$${item.profit.toLocaleString()}</td></tr>`).join('')}
                </tbody>
              </table>
            </div>

            <div class="section">
              <div class="section-title">Regional Performance</div>
              <table>
                <thead><tr><th>Region</th><th>Schools</th><th>Users</th><th>Growth Rate</th></tr></thead>
                <tbody>
                  ${regionalData.map(item => `<tr><td>${item.region}</td><td>${item.schools}</td><td>${item.users.toLocaleString()}</td><td>${item.growth}%</td></tr>`).join('')}
                </tbody>
              </table>
            </div>

            <div class="section">
              <div class="section-title">Vendor Performance by Category</div>
              <table>
                <thead><tr><th>Category</th><th>Orders</th><th>Revenue</th><th>Rating</th></tr></thead>
                <tbody>
                  ${vendorPerformanceData.map(item => `<tr><td>${item.category}</td><td>${item.orders}</td><td>$${item.revenue.toLocaleString()}</td><td>${item.rating}/5</td></tr>`).join('')}
                </tbody>
              </table>
            </div>
          </body>
          </html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Analytics_Report_${new Date().toISOString().split('T')[0]}.html`;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);

        console.log('PDF export successful');
      } else if (format === 'csv') {
        // Generate CSV
        const csvData = [
          ['EduConnect Analytics Report'],
          ['Generated on', new Date().toLocaleDateString()],
          [''],
          ['=== REVENUE ANALYSIS ==='],
          ['Month', 'Revenue', 'Expenses', 'Profit'],
          ...revenueData.map(item => [item.month, item.revenue, item.expenses, item.profit]),
          [''],
          ['=== USER GROWTH ==='],
          ['Month', 'Students', 'Teachers', 'Parents'],
          ...userGrowthData.map(item => [item.month, item.students, item.teachers, item.parents]),
          [''],
          ['=== REGIONAL PERFORMANCE ==='],
          ['Region', 'Schools', 'Users', 'Growth %'],
          ...regionalData.map(item => [item.region, item.schools, item.users, item.growth]),
          [''],
          ['=== VENDOR PERFORMANCE ==='],
          ['Category', 'Orders', 'Revenue', 'Rating'],
          ...vendorPerformanceData.map(item => [item.category, item.orders, item.revenue, item.rating])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = `Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);

        console.log('CSV export successful');
      }
    } catch (error) {
      console.error(`Export failed for format: ${format}`, error);
      alert(`Failed to export ${format.toUpperCase()}. Please try again.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download size={20} className="mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download size={20} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <h2 className="mt-2">$1.2M</h2>
                <p className="text-sm text-[#16A34A] mt-1">↑ 23.5%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp size={24} className="text-[#2563EB]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Schools</p>
                <h2 className="mt-2">1,284</h2>
                <p className="text-sm text-[#16A34A] mt-1">↑ 12.5%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <School size={24} className="text-[#16A34A]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <h2 className="mt-2">28,492</h2>
                <p className="text-sm text-[#16A34A] mt-1">↑ 18.2%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Vendors</p>
                <h2 className="mt-2">456</h2>
                <p className="text-sm text-[#16A34A] mt-1">↑ 8.7%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Store size={24} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Profit Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#2563EB" fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="profit" stroke="#16A34A" fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* User Growth & School Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="students" stroke="#2563EB" strokeWidth={2} />
                <Line type="monotone" dataKey="teachers" stroke="#16A34A" strokeWidth={2} />
                <Line type="monotone" dataKey="parents" stroke="#9333EA" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>School Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={schoolTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {schoolTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Performance by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendorPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" fill="#2563EB" />
              <Bar yAxisId="right" dataKey="revenue" fill="#16A34A" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Regional Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Region</th>
                  <th className="text-left py-3 px-4">Schools</th>
                  <th className="text-left py-3 px-4">Users</th>
                  <th className="text-left py-3 px-4">Growth Rate</th>
                  <th className="text-left py-3 px-4">Performance</th>
                </tr>
              </thead>
              <tbody>
                {regionalData.map((region) => (
                  <tr key={region.region} className="border-b border-gray-100">
                    <td className="py-4 px-4">{region.region}</td>
                    <td className="py-4 px-4">{region.schools}</td>
                    <td className="py-4 px-4">{region.users.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className="text-[#16A34A]">↑ {region.growth}%</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#2563EB] h-2 rounded-full"
                          style={{ width: `${(region.growth / 20) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
