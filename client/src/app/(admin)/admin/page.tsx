"use client"
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { format } from 'date-fns'

import { FaUsers } from 'react-icons/fa'
import { MdReceiptLong } from 'react-icons/md'
import { HiOutlineDocumentText, HiOutlineDocumentDuplicate } from 'react-icons/hi2'
import { RootState } from 'app/redux/store'
import { useRouter } from 'next/navigation'
import IsAdmin from 'utils/IsAdmin'
import Axios from 'utils/Axios'
import { SummeryApi } from 'app/common/SummeryApi'
import AxiosToastError from 'utils/AxiosToastError'

interface DashboardStats {
    totalUsers: number
    totalServiceAgreements: number
    totalContracts: number
    totalScPlans: number
}

interface ActivityItem {
    id: string
    type: 'Service Agreement' | 'Contract'
    title: string
    status: string
    createdAt: string
    href: string
}

const StatCard = ({
    label,
    value,
    icon: Icon,
    color,
    href,
}: {
    label: string
    value: string | number
    icon: React.ElementType
    color: string
    href: string
}) => (
    <Link href={href} className="bg-white rounded-lg shadow p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="text-white text-xl" />
        </div>
        <div>
            <h3 className="text-gray-500 text-sm font-medium">{label}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
        </div>
    </Link>
)

const statusColor: Record<string, string> = {
    DRAFT: "bg-yellow-100 text-yellow-700",
    SIGNED: "bg-green-100 text-green-700",
    ARCHIVED: "bg-gray-100 text-gray-600",
    SUBMITTED: "bg-blue-100 text-blue-700",
}

const typeColor: Record<string, string> = {
    'Service Agreement': "bg-indigo-50 text-indigo-700 border-indigo-200",
    'Contract': "bg-teal-50 text-teal-700 border-teal-200",
}

const AdminDashboard = () => {
    const { user } = useSelector((state: RootState) => state.userSlice)
    const router = useRouter()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user && !IsAdmin(user.role)) {
            router.push("/")
        }
    }, [user, router])

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true)
                const [usersRes, agreementsRes, contractsRes, scPlansRes] = await Promise.allSettled([
                    Axios({ ...SummeryApi.getAllUser }),
                    Axios({ ...SummeryApi.getServiceAgreements }),
                    Axios({ ...SummeryApi.getContracts }),
                    Axios({ ...SummeryApi.getScPlans }),
                ])

                const users = usersRes.status === "fulfilled" && usersRes.value.data?.success ? (usersRes.value.data.data || []) : []
                const agreements = agreementsRes.status === "fulfilled" && agreementsRes.value.data?.success ? (agreementsRes.value.data.data || []) : []
                const contracts = contractsRes.status === "fulfilled" && contractsRes.value.data?.success ? (contractsRes.value.data.data || []) : []
                const scPlans = scPlansRes.status === "fulfilled" && scPlansRes.value.data?.success ? (scPlansRes.value.data.data || []) : []

                setStats({
                    totalUsers: users.length,
                    totalServiceAgreements: agreements.length,
                    totalContracts: contracts.length,
                    totalScPlans: scPlans.length,
                })

                const activity: ActivityItem[] = [
                    ...agreements.map((a: any): ActivityItem => ({
                        id: a.id,
                        type: 'Service Agreement',
                        title: a.participantName || 'Unnamed',
                        status: a.status,
                        createdAt: a.createdAt,
                        href: '/admin/service-agreements',
                    })),
                    ...contracts.map((c: any): ActivityItem => ({
                        id: c.id,
                        type: 'Contract',
                        title: c.employeeName || 'Unnamed',
                        status: c.status,
                        createdAt: c.createdAt,
                        href: '/admin/contracts',
                    })),
                ]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 8)
                setRecentActivity(activity)
            } catch (error) {
                AxiosToastError(error)
            } finally {
                setLoading(false)
            }
        }

        if (user && IsAdmin(user.role)) {
            fetchDashboardData()
        }
    }, [user])

    const formatDate = (dateStr: string) => {
        try { return format(new Date(dateStr), 'dd MMM yyyy'); } catch { return dateStr; }
    }

    const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || ''

    if (loading) {
        return (
            <div className="w-full h-full p-6 bg-slate-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        )
    }

    return (
        <div className="w-full h-full p-6 bg-slate-100">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    Welcome, {displayName}
                </h1>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard label="Total Users" value={stats?.totalUsers ?? 0} icon={FaUsers} color="bg-purple-500" href="/admin/users" />
                    <StatCard label="Service Agreements" value={stats?.totalServiceAgreements ?? 0} icon={HiOutlineDocumentText} color="bg-blue-500" href="/admin/service-agreements" />
                    <StatCard label="Contracts" value={stats?.totalContracts ?? 0} icon={HiOutlineDocumentDuplicate} color="bg-teal-500" href="/admin/contracts" />
                    <StatCard label="SC Billing Plans" value={stats?.totalScPlans ?? 0} icon={MdReceiptLong} color="bg-amber-500" href="/admin/sc-billing" />
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                    </div>
                    <div className="overflow-x-auto">
                        {recentActivity.length === 0 ? (
                            <p className="text-gray-500 p-6">No service agreements or contracts yet.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentActivity.map((item) => (
                                        <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-block text-xs font-semibold rounded border px-2 py-1 ${typeColor[item.type]}`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.title}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[item.status] || "bg-gray-100 text-gray-600"}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {formatDate(item.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <Link href={item.href} className="text-sm text-blue-600 hover:underline font-medium">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
