"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export function DashboardHeader() {
  // Get full user object from Redux auth slice
  const user = useSelector((state: RootState) => state.auth.user);

  const roleConfig = {
    parent: {
      badge: {
        bg: "bg-[#FFFD77]",
        text: "text-[#243E36]",
        label: "Parent Dashboard",
      },
      greeting: `Hi ${user?.name ?? "User"} 👋`,
      subtitle: "Track your child's fitness journey",
    },
    coach: {
      badge: {
        bg: "bg-[#FFFD77]",
        text: "text-[#243E36]",
        label: "Coach Dashboard",
      },
      greeting: `Hi Coach ${user?.name ?? ""} 👋`,
      subtitle: "Ready to inspire young athletes today?",
    },
    admin: {
      badge: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Admin Dashboard",
      },
      greeting: `Welcome back, ${user?.name ?? "Admin"} 👋`,
      subtitle: "Manage the platform and monitor activity",
    },
    team: {
      badge: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Team Dashboard",
      },
      greeting: `Hi ${user?.name ?? "Team Member"} 👋`,
      subtitle: "Collaborate and manage your tasks",
    },
    client: {
      badge: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Client Dashboard",
      },
      greeting: `Hi ${user?.name ?? "Client"} 👋`,
      subtitle: "Access your services and track updates",
    },
  };

  const config = user ? roleConfig[user.role] : null;
  const [selectedKid, setSelectedKid] = useState<string>("");

  useEffect(() => {
    // Adjust this logic if your backend provides children separately
    if (user?.role === "client" && (user as any).kids?.length) {
      setSelectedKid(String((user as any).kids[0].id));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-gray-500">Loading user...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left side: greeting */}
        <div>
          <h1 className="text-md sm:text-md font-semibold text-gray-800">
            {config?.greeting}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">{config?.subtitle}</p>
        </div>

        {/* Right side: kid selection (only for parents) */}
        {user.role === "client" && (
          <div>
            {(user as any).kids && (user as any).kids.length > 0 ? (
              (user as any).kids.length === 1 ? (
                <span className="px-3 py-1 rounded-md bg-gray-100 text-sm font-medium text-gray-700 shadow-sm">
                  {(user as any).kids[0].name}
                </span>
              ) : (
                <Select
                  value={selectedKid}
                  onValueChange={(val) => setSelectedKid(val)}
                >
                  <SelectTrigger className="w-[160px] text-sm">
                    <SelectValue placeholder="Select Kid" />
                  </SelectTrigger>
                  <SelectContent>
                    {(user as any).kids.map((kid: any) => (
                      <SelectItem key={kid.id} value={String(kid.id)}>
                        {kid.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            ) : (
              <span className="px-3 py-1 rounded-md bg-gray-50 text-sm font-medium text-gray-400 italic">
                Kid Name
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
