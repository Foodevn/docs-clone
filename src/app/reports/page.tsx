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
    RefreshCw,
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
            const response = await fetch("/api/reports/stats");

            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/sign-in");
                    return;
                }
                throw new Error("Failed to fetch report data");
            }

            const data = (await response.json()) as ReportStats;
            setStats(data);
        } catch (error) {
            console.error("Error fetching report data:", error);
            toast.error("Failed to load report data");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchReportData();
        setRefreshing(false);
        toast.success("Data refreshed");
    };

    const handleExport = () => {
        if (!stats) return;

        const dataStr = JSON.stringify(stats, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `report-${new Date().toISOString().split("T")[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Report exported");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <Card className="w-full max-w-md border-0 shadow-lg">
                    <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-blue-600 to-indigo-500 rounded-t-xl" />
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Failed to load report data</p>
                        <Button onClick={() => router.push("/")} className="w-full mt-4">
                            ← Back to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // helpers
    const maxTrend = Math.max(1, ...stats.documentTrend.map((d) => d.count));
    const maxOrg = Math.max(1, ...stats.documentsByOrganization.map((o) => o.count));

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-[#F8FBFF] to-[#F4F7FB]">
            {/* Header (H2 – White Minimal with accent) */}
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                            <Button variant="ghost" onClick={() => router.push("/")} className="-ml-2 mr-1">
                                ← Back
                            </Button>
                            <div className="min-w-0">
                                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                                    Reports & Analytics
                                </h1>
                                <p className="text-sm text-slate-500">An overview of your activity and documents</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="gap-2 border-slate-200 hover:border-slate-300"
                            >
                                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                                Refresh
                            </Button>
                            <Button onClick={handleExport} className="gap-2 bg-blue-600 hover:bg-blue-700">
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats – C1: white cards, gradient top line */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard
                        title="Total documents"
                        icon={<FileText className="h-4 w-4 text-blue-600" />}
                        primary={`${stats.totalDocuments}`}
                        sub={`${stats.personalDocuments} personal, ${stats.organizationDocuments} organization`}
                    />

                    <StatCard
                        title="Organizations"
                        icon={<Building2 className="h-4 w-4 text-blue-600" />}
                        primary={`${stats.totalOrganizations}`}
                        sub="Joined organizations"
                    />

                    <StatCard
                        title="This month"
                        icon={<Calendar className="h-4 w-4 text-blue-600" />}
                        primary={`${stats.documentsThisMonth}`}
                        sub="New documents created"
                    />

                    <StatCard
                        title="Today"
                        icon={<Clock className="h-4 w-4 text-blue-600" />}
                        primary={`${stats.documentsToday}`}
                        sub="New documents"
                    />
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-100/60">
                        <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-white">
                            <BarChart3 className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="gap-2 data-[state=active]:bg-white">
                            <Activity className="h-4 w-4" />
                            Activity
                        </TabsTrigger>
                        <TabsTrigger value="distribution" className="gap-2 data-[state=active]:bg-white">
                            <PieChart className="h-4 w-4" />
                            Distribution
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="border-0 shadow-sm">
                                <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-blue-600 to-indigo-500 rounded-t-xl" />
                                <CardHeader>
                                    <CardTitle>Document creation trend</CardTitle>
                                    <CardDescription>New documents over time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {stats.documentTrend?.length ? (
                                        <div className="space-y-3">
                                            {stats.documentTrend.map((item, i) => {
                                                const pct = Math.min((item.count / maxTrend) * 100, 100);
                                                return (
                                                    <div key={i} className="flex items-center justify-between">
                                                        <span className="text-sm text-slate-500">
                                                            {new Date(item.date).toLocaleDateString("en-GB")}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-40 sm:w-56 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-sky-400 via-blue-600 to-indigo-500 rounded-full"
                                                                    style={{ width: `${pct}%` }}
                                                                    aria-label={`Ratio ${pct.toFixed(0)}%`}
                                                                />
                                                            </div>
                                                            <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-8">No trend data yet</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-sm">
                                <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-blue-600 to-indigo-500 rounded-t-xl" />
                                <CardHeader>
                                    <CardTitle>Quick stats</CardTitle>
                                    <CardDescription>Recent activity</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <QuickStat
                                        icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
                                        label="This week"
                                        value={stats.documentsThisWeek}
                                        bg="bg-sky-50"
                                        text="text-blue-600"
                                    />
                                    <QuickStat
                                        icon={<Users className="h-5 w-5 text-blue-600" />}
                                        label="Personal documents"
                                        value={stats.personalDocuments}
                                        bg="bg-blue-50"
                                        text="text-blue-700"
                                    />
                                    <QuickStat
                                        icon={<Building2 className="h-5 w-5 text-blue-600" />}
                                        label="Organization documents"
                                        value={stats.organizationDocuments}
                                        bg="bg-indigo-50"
                                        text="text-indigo-700"
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Activity */}
                    <TabsContent value="activity">
                        <Card className="border-0 shadow-sm">
                            <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-blue-600 to-indigo-500 rounded-t-xl" />
                            <CardHeader>
                                <CardTitle>Recent activity</CardTitle>
                                <CardDescription>Creation and edit history</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {stats.recentActivity?.length ? (
                                    <div className="space-y-3">
                                        {stats.recentActivity.map((a) => (
                                            <div
                                                key={a.id}
                                                className="flex items-start gap-4 p-4 border rounded-xl hover:shadow-sm hover:bg-slate-50 transition"
                                            >
                                                <div className="p-2 bg-blue-100 rounded-full">
                                                    <FileText className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium truncate">{a.title}</h4>
                                                    <p className="text-sm text-slate-500">{a.action}</p>
                                                </div>
                                                <span className="text-xs text-slate-500 whitespace-nowrap">
                                                    {new Date(a.date).toLocaleDateString("en-GB")}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">No activity yet</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Distribution */}
                    <TabsContent value="distribution">
                        <Card className="border-0 shadow-sm">
                            <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-blue-600 to-indigo-500 rounded-t-xl" />
                            <CardHeader>
                                <CardTitle>Document distribution by organization</CardTitle>
                                <CardDescription>Document count per organization</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {stats.documentsByOrganization?.length ? (
                                    <div className="space-y-5">
                                        {stats.documentsByOrganization.map((org, i) => {
                                            const pct = Math.min((org.count / maxOrg) * 100, 100);
                                            return (
                                                <div key={`${org.organizationName}-${i}`} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <Building2 className="h-4 w-4 text-slate-500" />
                                                            <span className="font-medium truncate">{org.organizationName}</span>
                                                        </div>
                                                        <span className="text-sm font-semibold">{org.count} documents</span>
                                                    </div>
                                                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-sky-400 via-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                                                            style={{ width: `${pct}%` }}
                                                            aria-label={`Share ${pct.toFixed(0)}%`}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">No documents in any organization</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

/* ----------------------------- Sub Components ---------------------------- */
function StatCard({
    title,
    icon,
    primary,
    sub,
}: {
    title: string;
    icon: React.ReactNode;
    primary: string | number;
    sub?: string;
}) {
    return (
        <Card className="group relative border-0 shadow-sm transition hover:shadow-md">
            <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-blue-600 to-indigo-500 rounded-t-xl" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
                <div className="opacity-80 group-hover:opacity-100 transition">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold tracking-tight text-slate-900">{primary}</div>
                {sub ? <p className="text-xs text-slate-500 mt-1">{sub}</p> : null}
            </CardContent>
        </Card>
    );
}

function QuickStat({
    icon,
    label,
    value,
    bg,
    text,
}: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    bg: string;
    text: string;
}) {
    return (
        <div className={`flex items-center justify-between p-3 rounded-xl ${bg}`}>
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-sm font-medium text-slate-700">{label}</span>
            </div>
            <span className={`text-xl font-bold ${text}`}>{value}</span>
        </div>
    );
}
