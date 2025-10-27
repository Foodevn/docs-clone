"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Mail,
    Calendar,
    Building2,
    Shield,
    LogOut,
    Loader2,
    Settings,
    Key
} from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
}

interface Organization {
    id: string;
    name: string;
    description: string | null;
    role: string;
    createdAt: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [organizations, setOrganizations] = useState<Organization[]>([]);

    // Form states
    const [name, setName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/me');

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/sign-in');
                    return;
                }
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            setUser(data.user);
            setName(data.user.name || "");
            setOrganizations(data.organizations || []);
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Name is required');
            return;
        }

        try {
            setSaving(true);
            const response = await fetch('/api/auth/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim() })
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const data = await response.json();
            setUser(data.user);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('All password fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            setSaving(true);
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to change password');
            }

            toast.success('Password changed successfully');
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            router.push('/sign-in');
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Failed to logout');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Failed to load user profile</p>
                        <Button onClick={() => router.push('/')} className="w-full mt-4">
                            Go to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getInitials = (name: string | null, email: string) => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        return email.slice(0, 2).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/')}
                            >
                                ← Back to Home
                            </Button>
                            <h1 className="text-2xl font-bold">Profile Settings</h1>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={handleLogout}
                            className="gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid gap-6 md:grid-cols-12">
                    {/* Sidebar */}
                    <div className="md:col-span-4">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="flex justify-center mb-4">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src="" />
                                        <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                            {getInitials(user.name, user.email)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <CardTitle>{user.name || 'No Name'}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Building2 className="h-4 w-4" />
                                        <span className="font-medium">{organizations.length} Organizations</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-8">
                        <Tabs defaultValue="general" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="general" className="gap-2">
                                    <Settings className="h-4 w-4" />
                                    General
                                </TabsTrigger>
                                <TabsTrigger value="security" className="gap-2">
                                    <Key className="h-4 w-4" />
                                    Security
                                </TabsTrigger>
                                <TabsTrigger value="organizations" className="gap-2">
                                    <Building2 className="h-4 w-4" />
                                    Organizations
                                </TabsTrigger>
                            </TabsList>

                            {/* General Tab */}
                            <TabsContent value="general">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>General Information</CardTitle>
                                        <CardDescription>
                                            Update your personal information
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <div className="flex gap-2">
                                                    <User className="h-4 w-4 mt-3 text-muted-foreground" />
                                                    <Input
                                                        id="name"
                                                        placeholder="Enter your name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="flex-1"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <div className="flex gap-2">
                                                    <Mail className="h-4 w-4 mt-3 text-muted-foreground" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={user.email}
                                                        disabled
                                                        className="flex-1 bg-gray-50"
                                                    />
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Email cannot be changed
                                                </p>
                                            </div>

                                            <div className="flex justify-end gap-2 pt-4">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setName(user.name || "")}
                                                    disabled={saving}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button type="submit" disabled={saving}>
                                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Security Tab */}
                            <TabsContent value="security">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Change Password</CardTitle>
                                        <CardDescription>
                                            Update your password to keep your account secure
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleChangePassword} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="currentPassword">Current Password</Label>
                                                <Input
                                                    id="currentPassword"
                                                    type="password"
                                                    placeholder="Enter current password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="newPassword">New Password</Label>
                                                <Input
                                                    id="newPassword"
                                                    type="password"
                                                    placeholder="Enter new password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="Confirm new password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            </div>

                                            <div className="flex justify-end gap-2 pt-4">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setCurrentPassword("");
                                                        setNewPassword("");
                                                        setConfirmPassword("");
                                                    }}
                                                    disabled={saving}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button type="submit" disabled={saving}>
                                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Change Password
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Organizations Tab */}
                            <TabsContent value="organizations">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Your Organizations</CardTitle>
                                        <CardDescription>
                                            Organizations you are a member of
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {organizations.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                                <p>You are not a member of any organization yet</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {organizations.map((org) => (
                                                    <div
                                                        key={org.id}
                                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <Avatar>
                                                                <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-500 text-white">
                                                                    {org.name.slice(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <h4 className="font-medium">{org.name}</h4>
                                                                {org.description && (
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {org.description}
                                                                    </p>
                                                                )}
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    Joined {new Date(org.createdAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge variant={org.role === 'Owner' ? 'default' : 'secondary'}>
                                                            <Shield className="h-3 w-3 mr-1" />
                                                            {org.role}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}