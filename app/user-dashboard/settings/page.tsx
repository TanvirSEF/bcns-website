"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Shield, Globe, User as UserIcon, Lock, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "react-toastify";

// Simple localStorage-backed state hook (SSR-safe via useEffect)
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(initial);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) setValue(JSON.parse(stored) as T);
    } catch { /* ignore */ }
  }, [key]);

  const update = React.useCallback(
    (v: T) => {
      setValue(v);
      try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ }
    },
    [key],
  );

  return [value, update] as const;
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  );
}

export default function UserSettingsPage() {
  const { user } = useAuth();

  // Notification preferences (localStorage)
  const [emailNotif, setEmailNotif] = useLocalStorage("bcns_notif_email", true);
  const [eventReminders, setEventReminders] = useLocalStorage("bcns_notif_events", true);
  const [pubUpdates, setPubUpdates] = useLocalStorage("bcns_notif_pubs", true);
  const [newsletter, setNewsletter] = useLocalStorage("bcns_notif_newsletter", false);

  // Display preferences (localStorage)
  const [language, setLanguage] = useLocalStorage("bcns_pref_language", "en");
  const [timezone, setTimezone] = useLocalStorage("bcns_pref_timezone", "Asia/Dhaka");

  const toggle = (setter: (v: boolean) => void, label: string) => (v: boolean) => {
    setter(v);
    toast.success(`${label} ${v ? "enabled" : "disabled"}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-linear-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-gray-900">Settings</h1>
        <p className="text-gray-700">Manage your account, notifications, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserIcon className="h-5 w-5" />
              Account Overview
            </CardTitle>
            <CardDescription>Your account information. Edit details on your profile page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium">{user?.name || "—"}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{user?.email || "—"}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Role</span>
              <Badge variant="secondary" className="capitalize">{user?.role || "member"}</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Membership</span>
              <Badge variant="secondary" className="capitalize">
                {user?.membershipType === "lifetime" ? "Lifetime" : "General"}
              </Badge>
            </div>
            <Button asChild variant="outline" className="w-full mt-3">
              <Link href="/user-dashboard/profile">
                <ExternalLink className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Choose what updates you'd like to receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow
              label="Email Notifications"
              description="Receive general updates via email"
              checked={emailNotif}
              onChange={toggle(setEmailNotif, "Email notifications")}
            />
            <Separator />
            <ToggleRow
              label="Event Reminders"
              description="Get notified about upcoming events"
              checked={eventReminders}
              onChange={toggle(setEventReminders, "Event reminders")}
            />
            <Separator />
            <ToggleRow
              label="Publication Updates"
              description="New research and publications"
              checked={pubUpdates}
              onChange={toggle(setPubUpdates, "Publication updates")}
            />
            <Separator />
            <ToggleRow
              label="Newsletter"
              description="Monthly BCNS newsletter"
              checked={newsletter}
              onChange={toggle(setNewsletter, "Newsletter")}
            />
            <p className="text-xs text-muted-foreground italic pt-1">
              Saved on this device. Will take full effect when the email notification system is integrated.
            </p>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Account security and authentication.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Badge variant="secondary">Not enabled</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Password</Label>
                <p className="text-sm text-muted-foreground">Change your account password</p>
              </div>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/user-dashboard/profile">
                <ExternalLink className="h-4 w-4 mr-2" />
                Change Password
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Display Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5" />
              Preferences
            </CardTitle>
            <CardDescription>Customize your dashboard experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={language}
                onValueChange={(v) => {
                  setLanguage(v);
                  toast.success("Language preference saved");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select
                value={timezone}
                onValueChange={(v) => {
                  setTimezone(v);
                  toast.success("Timezone preference saved");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground italic pt-1">
              Preferences are saved on this device.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
