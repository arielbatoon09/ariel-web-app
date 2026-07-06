"use client";

import * as React from "react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { DataTable } from "@/components/features/dashboard/data-table";
import type { Service } from "@/lib/schemas/dashboard";

export default function AdminServicesPage() {
  const { services, addService, deleteService, toggleServiceStatus } = useDashboardStore();

  const columns = [
    {
      header: "Service Package",
      accessorKey: (item: Service) => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-foreground">{item.name}</span>
            {item.disabled && (
              <span className="rounded border border-red-200 bg-red-50/20 px-1 py-0.5 font-mono text-[8px] text-red-500 uppercase dark:border-red-900/30">
                Disabled
              </span>
            )}
          </div>
          <p className="max-w-md text-xs leading-relaxed text-neutral-400 dark:text-neutral-500">{item.description}</p>
        </div>
      ),
    },
    {
      header: "Base Price",
      accessorKey: (item: Service) => <span className="font-mono text-xs font-bold text-foreground">₱{item.price.toLocaleString()}</span>,
    },
    {
      header: "Timeline",
      accessorKey: "deliveryTime" as keyof Service,
    },
    {
      header: "Add-Ons",
      accessorKey: (item: Service) => (
        <div className="flex flex-wrap gap-1">
          {item.addOns.map((add) => (
            <span
              key={add.id}
              className="rounded border border-neutral-300 bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-400"
              title={add.description}
            >
              {add.name} (+₱{add.price.toLocaleString()})
            </span>
          ))}
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    const name = window.prompt("Enter Service Name:");
    if (!name) return;
    const desc = window.prompt("Enter Description:") || "";
    const priceInput = window.prompt("Enter Price:", "100000") || "0";
    const price = parseInt(priceInput, 10);
    const timeline = window.prompt("Enter Timeline:", "3-4 Weeks") || "3-4 Weeks";

    const newService: Service = {
      id: `srv-${Date.now()}`,
      name,
      description: desc,
      price,
      deliveryTime: timeline,
      features: ["Custom Web Application", "Responsive Styling", "Database Setup"],
      addOns: [],
    };

    addService(newService);
  };

  const handleDelete = (item: Service) => {
    if (window.confirm(`Are you sure you want to delete the service "${item.name}"?`)) {
      deleteService(item.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">Services</h1>
        <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">MANAGE SERVICES, TIMELINES, FEATURES, AND DYNAMIC ADD-ONS</p>
      </div>

      <DataTable<Service>
        data={services}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search services..."
        onAddClick={handleAdd}
        onViewClick={(item) => alert(`VIEWING SERVICE: ${item.name}\nBase Price: ₱${item.price.toLocaleString()}\nTimeline: ${item.deliveryTime}`)}
        onEditClick={(item) => {
          const newName = window.prompt("Edit Service Name:", item.name);
          if (newName) {
            useDashboardStore.getState().updateService({ ...item, name: newName });
          }
        }}
        onToggleStatusClick={(item) => toggleServiceStatus(item.id)}
        onDeleteClick={handleDelete}
        addButtonLabel="Add Service"
      />
    </div>
  );
}
