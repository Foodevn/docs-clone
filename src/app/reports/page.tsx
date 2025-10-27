"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    FileText,
    Users,
    Building2,
    TrendingUp,
    Calendar,
    Clock,
    BarChart3,
    PieChart,
    Activity,
    Loader2,
    Download,
    RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface ReportStats {
    totalDocuments: number;
    personalDocuments: number;
    organizationDocuments: number;
    totalOrganizations: number;
    documentsThisMonth: number;
    documentsThisWeek: number;
    documentsToday: number;
    recentActivity: Array<{
        id: string;
        title: string;
        action: string;
        date: string;
    }>;
    documentsByOrganization: Array<{
        organizationName: string;
        count: number;
    }>;
    documentTrend: Array<{
        date: string;
        count: number;
    }>;
}

export default function ReportsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState<ReportStats | null>(null);

    useEffect(() => {
        fetchReportData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/reports/stats');

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/sign-in');
                    return;
                }
                throw new Error('Failed to fetch report data');
            }

            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching report data:', error);
            toast.error('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchReportData();
        setRefreshing(false);
        toast.success('Data refreshed');
    };

    const handleExport = () => {
        if (!stats) return;

        const dataStr = JSON.stringify(stats, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Report exported');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Failed to load report data</p>
                        <Button onClick={() => router.push('/')} className="w-full mt-4">
                            Go to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/')}
                            >
                                ← Back to Home
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Tổng quan về hoạt động và tài liệu của bạn
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="gap-2"
                            >
                                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button
                                onClick={handleExport}
                                className="gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Tổng tài liệu
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.personalDocuments} cá nhân, {stats.organizationDocuments} tổ chức
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Tổ chức
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
                            <p className="text-xs text-muted-foreground">
                                Tổ chức tham gia
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Tháng này
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.documentsThisMonth}</div>
                            <p className="text-xs text-muted-foreground">
                                Tài liệu mới tạo
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Hôm nay
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.documentsToday}</div>
                            <p className="text-xs text-muted-foreground">
                                Tài liệu mới
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Reports */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview" className="gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Tổng quan
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="gap-2">
                            <Activity className="h-4 w-4" />
                            Hoạt động
                        </TabsTrigger>
                        <TabsTrigger value="distribution" className="gap-2">
                            <PieChart className="h-4 w-4" />
                            Phân bổ
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Xu hướng tạo tài liệu</CardTitle>
                                    <CardDescription>
                                        Số lượng tài liệu mới theo thời gian
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {stats.documentTrend && stats.documentTrend.length > 0 ? (
                                            stats.documentTrend.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(item.date).toLocaleDateString('vi-VN')}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-500 rounded-full"
                                                                style={{
                                                                    width: `${Math.min((item.count / Math.max(...stats.documentTrend.map(d => d.count))) * 100, 100)}%`
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground text-center py-8">
                                                Chưa có dữ liệu xu hướng
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Thống kê nhanh</CardTitle>
                                    <CardDescription>
                                        Hoạt động gần đây
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-blue-600" />
                                            <span className="text-sm font-medium">Tuần này</span>
                                        </div>
                                        <span className="text-xl font-bold text-blue-600">
                                            {stats.documentsThisWeek}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-green-600" />
                                            <span className="text-sm font-medium">Tài liệu cá nhân</span>
                                        </div>
                                        <span className="text-xl font-bold text-green-600">
                                            {stats.personalDocuments}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-5 w-5 text-purple-600" />
                                            <span className="text-sm font-medium">Tài liệu tổ chức</span>
                                        </div>
                                        <span className="text-xl font-bold text-purple-600">
                                            {stats.organizationDocuments}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hoạt động gần đây</CardTitle>
                                <CardDescription>
                                    Lịch sử tạo và chỉnh sửa tài liệu
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {stats.recentActivity && stats.recentActivity.length > 0 ? (
                                    <div className="space-y-4">
                                        {stats.recentActivity.map((activity) => (
                                            <div
                                                key={activity.id}
                                                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition"
                                            >
                                                <div className="p-2 bg-blue-100 rounded-full">
                                                    <FileText className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium truncate">{activity.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                                                </div>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {new Date(activity.date).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">
                                        Chưa có hoạt động nào
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Distribution Tab */}
                    <TabsContent value="distribution">
                        <Card>
                            <CardHeader>
                                <CardTitle>Phân bổ tài liệu theo tổ chức</CardTitle>
                                <CardDescription>
                                    Số lượng tài liệu trong từng tổ chức
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {stats.documentsByOrganization && stats.documentsByOrganization.length > 0 ? (
                                    <div className="space-y-4">
                                        {stats.documentsByOrganization.map((org, index) => {
                                            const maxCount = Math.max(...stats.documentsByOrganization.map(o => o.count));
                                            const percentage = (org.count / maxCount) * 100;

                                            return (
                                                <div key={index} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium">{org.organizationName}</span>
                                                        </div>
                                                        <span className="text-sm font-bold">{org.count} tài liệu</span>
                                                    </div>
                                                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">
                                        Chưa có tài liệu trong tổ chức nào
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
