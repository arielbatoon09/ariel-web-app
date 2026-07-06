"use client";

import * as React from "react";
import Link from "next/link";
import { useAuthStore } from "@/hooks/use-auth-store";
import { ShoppingBag, Settings, LayoutDashboard, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();

  const mockOrders = [
    { id: "ORD-001", name: "Custom Web Application", status: "in-progress", price: "₱45,000", date: "2026-07-01" },
    { id: "ORD-002", name: "UI/UX Consultations", status: "completed", price: "₱15,000", date: "2026-06-15" },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Welcome Panel */}
      <div className="relative overflow-hidden border border-neutral-300 bg-neutral-50/50 p-6 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/40">
        <div className="pointer-events-none absolute top-0 right-0 p-2 font-mono text-[9px] text-neutral-300 dark:text-neutral-700">SYS_SEC_OK</div>
        <div className="max-w-2xl space-y-2">
          <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">Active Session</span>
          <h1 className="font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">Welcome, {user?.email || "Valued Client"}</h1>
          <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
            Authorized client dashboard. Monitor development streams, view active order statuses, and access your delivery files.
          </p>
        </div>
      </div>

      {/* Stats / Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border border-neutral-300 bg-neutral-50/50 p-5 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/40">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase">Active Projects</span>
            <Clock className="size-4 text-blue-500" />
          </div>
          <p className="mt-3 font-sans text-2xl font-bold text-foreground">1</p>
          <span className="mt-1 block font-mono text-[9px] text-neutral-500">Currently in active development cycle</span>
        </div>

        <div className="border border-neutral-300 bg-neutral-50/50 p-5 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/40">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase">Total Orders</span>
            <ShoppingBag className="size-4 text-green-500" />
          </div>
          <p className="mt-3 font-sans text-2xl font-bold text-foreground">{mockOrders.length}</p>
          <span className="mt-1 block font-mono text-[9px] text-neutral-500">Sum of all purchased service tiers</span>
        </div>

        <div className="border border-neutral-300 bg-neutral-50/50 p-5 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/40">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase">Security Clearance</span>
            <CheckCircle className="size-4 text-neutral-500" />
          </div>
          <p className="mt-3 font-mono text-sm font-bold text-foreground uppercase">CLIENT_ROLE</p>
          <span className="mt-1 block font-mono text-[9px] text-neutral-500">Access limited to owned properties</span>
        </div>
      </div>

      {/* Orders Tracking Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-sans text-sm font-bold text-foreground">Recent Activities & Orders</h2>
            <p className="font-mono text-[10px] text-neutral-500">Tracking of current project status deliverables</p>
          </div>
        </div>

        <div className="border border-neutral-300 bg-neutral-50/50 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/40">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-neutral-300 bg-neutral-100 font-mono text-[10px] uppercase dark:border-neutral-700 dark:bg-neutral-900/80">
                  <th className="p-4 font-normal text-neutral-500">Order ID</th>
                  <th className="p-4 font-normal text-neutral-500">Service Title</th>
                  <th className="p-4 font-normal text-neutral-500">Date Ordered</th>
                  <th className="p-4 font-normal text-neutral-500">Status</th>
                  <th className="p-4 text-right font-normal text-neutral-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {mockOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-900/20">
                    <td className="dark:text-neutral-150 p-4 font-mono font-bold text-neutral-900">{order.id}</td>
                    <td className="p-4 font-medium text-neutral-800 dark:text-neutral-200">{order.name}</td>
                    <td className="p-4 text-neutral-500">{order.date}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[9px] uppercase ${
                          order.status === "completed"
                            ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                            : "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        <span className={`size-1 rounded-full ${order.status === "completed" ? "bg-green-500" : "bg-blue-500"}`} />
                        {order.status}
                      </span>
                    </td>
                    <td className="dark:text-neutral-150 p-4 text-right font-mono font-medium text-neutral-900">{order.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
