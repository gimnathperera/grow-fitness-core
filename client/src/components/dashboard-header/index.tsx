"use client";

import { useState, useEffect } from "react";
import type { User } from "@/types/dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const roleConfig = {
    parent: {
      badge: {
        bg: "bg-[#FFFD77]",
        text: "text-[#243E36]",
        label: "Parent Dashboard",
      },
      greeting: `Hi ${user.name} 👋`,
      subtitle: "Track your child's fitness journey",
    },
    coach: {
      badge: {
        bg: "bg-[#FFFD77]",
        text: "text-[#243E36]",
        label: "Coach Dashboard",
      },
      greeting: `Hi Coach ${user.name} 👋`,
      subtitle: "Ready to inspire young athletes today?",
    },
  };

  const config = roleConfig[user.role];
  const [selectedKid, setSelectedKid] = useState<string>("");

  useEffect(() => {
    if (user.role === "parent" && user.kids?.length) {
      setSelectedKid(String(user.kids[0].id));
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left side: greeting */}
        <div>
          <h1 className="text-md sm:text-md font-semibold text-gray-800">
            {config.greeting}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {config.subtitle}
          </p>
        </div>

        {/* Right side: kid selection */}
        {user.role === "parent" && (
          <div>
            {user.kids && user.kids.length > 0 ? (
              user.kids.length === 1 ? (
                <span className="px-3 py-1 rounded-md bg-gray-100 text-sm font-medium text-gray-700 shadow-sm">
                  {user.kids[0].name}
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
                    {user.kids.map((kid) => (
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
