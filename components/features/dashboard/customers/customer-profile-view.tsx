"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Shield, ShieldAlert, User, Clock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Customer } from "@/schemas/dashboard";

interface CustomerProfileViewProps {
  customer: Customer;
  onUpdateRole: (customer: Customer) => void;
  onToggleBlock: (customer: Customer) => void;
}

export function CustomerProfileView({ customer, onUpdateRole, onToggleBlock }: CustomerProfileViewProps) {
  return (
    <>
      {/* User Bio & Primary Settings */}
      <div className="space-y-4 border border-dashed border-neutral-300 bg-neutral-50/20 p-4 dark:border-neutral-700 dark:bg-neutral-900/10">
        <div className="space-y-1">
          <div className="text-[10px] text-neutral-400 uppercase">Name & Email</div>
          <div className="font-sans text-sm font-bold text-foreground">{customer.name}</div>
          <div className="text-neutral-550 dark:text-neutral-400">{customer.email}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-dashed border-neutral-200 pt-2 dark:border-neutral-800">
          {/* Change Role Button */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-neutral-400 uppercase">Change Account Role</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateRole(customer)}
              className="h-8 w-full justify-between rounded-none border-dashed font-mono text-[10px] uppercase"
            >
              <span>{customer.role === "admin" ? "Demote to User" : "Promote to Admin"}</span>
              {customer.role === "admin" ? <User className="size-3" /> : <Shield className="size-3" />}
            </Button>
          </div>

          {/* Block / Unblock Button */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-neutral-400 uppercase">System Ban / Block</div>
            <Button
              variant={customer.disabled ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleBlock(customer)}
              className={cn(
                "h-8 w-full justify-between rounded-none border-dashed font-mono text-[10px] uppercase",
                !customer.disabled && "text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/25"
              )}
            >
              <span>{customer.disabled ? "Unblock Account" : "Block Account"}</span>
              <ShieldAlert className="size-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="space-y-2">
        <h4 className="font-mono text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">User Audit Logs</h4>
        <div className="max-h-48 divide-y divide-dashed divide-neutral-200 overflow-y-auto border border-dashed border-neutral-300 dark:divide-neutral-800 dark:border-neutral-700">
          {customer.activities && customer.activities.length > 0 ? (
            customer.activities.map((act) => (
              <div key={act.id} className="space-y-1 p-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10">
                <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
                  <span className="font-sans font-medium">{act.action}</span>
                  <span className="text-neutral-450 flex items-center gap-1 text-[9px] dark:text-neutral-500">
                    <Clock className="size-2.5" />
                    {act.timestamp}
                  </span>
                </div>
                <div className="text-neutral-450 flex items-center gap-1 text-[9px] dark:text-neutral-500">
                  <Globe className="size-2.5" />
                  IP Address: {act.ipAddress}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-neutral-400 dark:text-neutral-500">No activities logged for this user.</div>
          )}
        </div>
      </div>
    </>
  );
}
