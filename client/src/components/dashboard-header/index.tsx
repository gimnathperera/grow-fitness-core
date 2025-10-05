"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setSelectedKidId } from "@/auth/authSlice";
import { useLazyGetKidQuery, useGetKidsQuery } from "@/services/kidsApi";

export function DashboardHeader() {
  // Get full user object from Redux auth slice
  const user = useSelector((state: RootState) => state.auth.user);

  console.log("User from Redux:", user);

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

  const dispatch = useDispatch();
  const [selectedKid, setSelectedKid] = useState<string>("");
  const [triggerGetKid, { data: kidResp, isFetching: isKidLoading }]= useLazyGetKidQuery();
  // If Redux user doesn't contain kids, fallback to API
  const { data: kidsListResp } = useGetKidsQuery(user?.role === "client" ? {} : undefined, { skip: user?.role !== "client" });

  // Resolve unified kids list for UI rendering
  const userKids = (user as any)?.kids as Array<{ id: string; name: string }> | undefined;
  const apiKids = (kidsListResp?.data as any[])?.map((k: any) => ({ id: String(k._id || k.id), name: k.name })) || [];
  const kidsForUi: Array<{ id: string; name: string }> = userKids?.length ? userKids.map((k: { id: string; name: string }) => ({ id: String(k.id), name: k.name })) : apiKids;

  useEffect(() => {
    console.log("User in useEffect:", user);
    if (user?.role === "client") {
      const userKids = (user as any)?.kids as Array<{ id: string; name: string }> | undefined;
      if (userKids?.length) {
        const firstId = String(userKids[0].id);
        setSelectedKid(firstId);
        dispatch(setSelectedKidId(firstId));
        console.log("Selected kid set to (from user):", userKids[0].id);
        return;
      }
      // Fallback to fetched kids list
      const apiKids = (kidsListResp?.data as any[]) ?? [];
      if (apiKids.length) {
        const firstId = String(apiKids[0]._id || apiKids[0].id);
        setSelectedKid(firstId);
        dispatch(setSelectedKidId(firstId));
        console.log("Selected kid set to (from api):", apiKids[0]._id || apiKids[0].id);
      }
    }
  }, [user, kidsListResp]);

  // Fetch kid details when selectedKid changes (or initially when default is set)
  useEffect(() => {
    if (user?.role === "client" && selectedKid) {
      dispatch(setSelectedKidId(selectedKid));
      triggerGetKid(selectedKid);
    }
  }, [user?.role, selectedKid, triggerGetKid]);

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
          {user.role === "client" && selectedKid && (
            <p className="text-[11px] text-gray-400 mt-1">
              {isKidLoading
                ? "Loading kid details..."
                : kidResp?.data?.name
                ? `Selected: ${kidResp.data.name}`
                : (() => {
                    const fallback = kidsForUi.find(k => k.id === selectedKid);
                    return fallback ? `Selected: ${fallback.name}` : null;
                  })()}
            </p>
          )}
        </div>

        {/* Right side: kid selection (only for parents) */}
{/* Right side: kid selection (only for parents/clients) */}
{user.role === "client" && (
  <div className="flex items-center gap-2">
    <h4 className="text-sm font-bold text-gray-700">Kid's Name:</h4>
    {kidsForUi && kidsForUi.length > 0 ? (
      kidsForUi.length === 1 ? (
        <span className="px-3 py-1 rounded-md bg-gray-100 text-sm font-medium text-gray-700 shadow-sm">
          {kidsForUi[0].name}
        </span>
      ) : (
        <Select
          value={selectedKid}
          onValueChange={(val) => {
            setSelectedKid(val);
            dispatch(setSelectedKidId(val));
            console.log("Kid selected:", val);
          }}
        >
          <SelectTrigger className="w-[160px] text-sm">
            <SelectValue placeholder="Select Kid" />
          </SelectTrigger>
          <SelectContent>
            {kidsForUi.map((kid) => (
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

