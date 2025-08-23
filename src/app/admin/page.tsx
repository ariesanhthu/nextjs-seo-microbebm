import { Card } from "@/components/ui/card"
import { BarChart3, Users, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>
        <div className="flex items-center gap-2">
          <select className="rounded-md border border-gray-300 px-3 py-1.5 text-sm">
            <option>7 ngày qua</option>
            <option>30 ngày qua</option>
            <option>Quý này</option>
            <option>Năm nay</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Doanh thu</p>
              <h3 className="mt-1 text-2xl font-bold">24.5M</h3>
              <p className="mt-1 flex items-center text-xs font-medium text-green-600">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                12.5% so với tháng trước
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Đơn hàng</p>
              <h3 className="mt-1 text-2xl font-bold">345</h3>
              <p className="mt-1 flex items-center text-xs font-medium text-green-600">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                8.2% so với tháng trước
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-2 text-blue-600">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Khách hàng</p>
              <h3 className="mt-1 text-2xl font-bold">1,249</h3>
              <p className="mt-1 flex items-center text-xs font-medium text-green-600">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                5.3% so với tháng trước
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-2 text-purple-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tỷ lệ chuyển đổi</p>
              <h3 className="mt-1 text-2xl font-bold">3.2%</h3>
              <p className="mt-1 flex items-center text-xs font-medium text-red-600">
                <ArrowDownRight className="mr-1 h-3 w-3" />
                0.5% so với tháng trước
              </p>
            </div>
            <div className="rounded-full bg-orange-100 p-2 text-orange-600">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="mb-4 text-lg font-medium">Đơn hàng gần đây</h2>
        <div className="overflow-hidden rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Mã đơn hàng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Khách hàng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Ngày đặt
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Tổng tiền
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {[
                {
                  id: "ECO-2304",
                  customer: "Nguyễn Văn A",
                  date: "15/04/2023",
                  total: "1,250,000đ",
                  status: "Đã giao hàng",
                  statusColor: "bg-green-100 text-green-800",
                },
                {
                  id: "ECO-2303",
                  customer: "Trần Thị B",
                  date: "14/04/2023",
                  total: "850,000đ",
                  status: "Đang giao hàng",
                  statusColor: "bg-blue-100 text-blue-800",
                },
                {
                  id: "ECO-2302",
                  customer: "Lê Văn C",
                  date: "13/04/2023",
                  total: "2,150,000đ",
                  status: "Đang xử lý",
                  statusColor: "bg-yellow-100 text-yellow-800",
                },
                {
                  id: "ECO-2301",
                  customer: "Phạm Thị D",
                  date: "12/04/2023",
                  total: "750,000đ",
                  status: "Đã giao hàng",
                  statusColor: "bg-green-100 text-green-800",
                },
                {
                  id: "ECO-2300",
                  customer: "Hoàng Văn E",
                  date: "11/04/2023",
                  total: "1,550,000đ",
                  status: "Đã hủy",
                  statusColor: "bg-red-100 text-red-800",
                },
              ].map((order, i) => (
                <tr key={i}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{order.customer}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{order.date}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.total}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
