"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { useCreateServiceMutation } from "@/hooks/use-services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { ArrowLeft, Loader2, Plus, Trash2, Settings } from "lucide-react";
import { toast } from "sonner";

import { MediaPickerDialog } from "@/components/common/media-picker-dialog";

const serviceFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  price: z.number().min(0, "Price must be positive."),
  deliveryTime: z.string().min(1, "Delivery time is required."),
  imageSrc: z.string(),
});

interface AddOnInput {
  name: string;
  price: number;
  description: string;
}

export function ServiceNewForm() {
  const router = useRouter();
  const createServiceMutation = useCreateServiceMutation();
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);

  // Features state
  const [features, setFeatures] = React.useState<string[]>([
    "Custom Web Application",
    "Responsive Styling",
    "Database Integration",
  ]);
  const [newFeatureText, setNewFeatureText] = React.useState("");

  // Add-ons state
  const [addOns, setAddOns] = React.useState<{ id: string; name: string; price: number; description: string }[]>([]);
  const [addonName, setAddonName] = React.useState("");
  const [addonPrice, setAddonPrice] = React.useState<number>(15000);
  const [addonDesc, setAddonDesc] = React.useState("");

  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures([...features, newFeatureText.trim()]);
      setNewFeatureText("");
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleAddAddon = () => {
    if (!addonName.trim()) {
      toast.error("Add-on name is required.");
      return;
    }
    const newAddon = {
      id: Math.random().toString(36).substring(2, 9) + "_" + Date.now(),
      name: addonName.trim(),
      price: addonPrice,
      description: addonDesc.trim(),
    };
    setAddOns([...addOns, newAddon]);
    setAddonName("");
    setAddonPrice(15000);
    setAddonDesc("");
    toast.success("Add-on added to list.");
  };

  const handleRemoveAddon = (id: string) => {
    setAddOns(addOns.filter((a) => a.id !== id));
  };

  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 150000,
      deliveryTime: "3 - 4 Weeks",
      imageSrc: "",
    },
    validators: {
      onSubmit: serviceFormSchema,
    },
    onSubmit: async ({ value }) => {
      createServiceMutation.mutate(
        {
          name: value.name,
          slug: value.slug,
          description: value.description,
          price: value.price,
          deliveryTime: value.deliveryTime,
          features: features.filter(Boolean),
          addOns: addOns,
          imageSrc: value.imageSrc,
        },
        {
          onSuccess: () => {
            toast.success("Service package created successfully.");
            router.push("/admin/services");
          },
        }
      );
    },
  });

  const isPending = createServiceMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/services")}
          className="-ml-3 h-8 cursor-pointer rounded-none px-3 font-mono text-[10px] uppercase tracking-wider text-neutral-450 hover:bg-neutral-100 hover:text-foreground dark:hover:bg-neutral-800"
        >
          <ArrowLeft className="mr-1.5 size-3.5" /> Back to Packages
        </Button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Form Core Details */}
        <div className="border border-dashed border-neutral-300 bg-neutral-50/50 p-6 dark:border-neutral-700 dark:bg-neutral-900/40 lg:col-span-2 space-y-6">
          <div className="border-b border-dashed border-neutral-300 pb-4 dark:border-neutral-700">
            <h2 className="font-sans text-sm font-bold tracking-widest text-foreground uppercase">Package Specifications</h2>
            <p className="font-mono text-[10px] text-neutral-400 uppercase mt-1">Core details, pricing parameters and delivery estimates</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4 font-mono text-xs"
          >
            {/* Name */}
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-[10px] tracking-widest text-neutral-400 uppercase">
                      Package Name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        // Auto-slugify
                        const generatedSlug = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "");
                        form.setFieldValue("slug", generatedSlug);
                      }}
                      disabled={isPending}
                      placeholder="e.g. Startup MVP Launch"
                      className="h-9 rounded-none border-dashed border-neutral-300 bg-background/50 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                  </Field>
                );
              }}
            />

            {/* Slug */}
            <form.Field
              name="slug"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-[10px] tracking-widest text-neutral-400 uppercase">
                      Slug Reference
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ""))}
                      disabled={isPending}
                      placeholder="e.g. startup-mvp-launch"
                      className="h-9 rounded-none border-dashed border-neutral-300 bg-background/50 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                  </Field>
                );
              }}
            />

            {/* Description */}
            <form.Field
              name="description"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-[10px] tracking-widest text-neutral-400 uppercase">
                      Description
                    </FieldLabel>
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                      placeholder="Write a clear summary of what this package offers..."
                      rows={4}
                      className="w-full resize-none rounded-none border border-dashed border-neutral-300 bg-background/50 p-2.5 outline-none focus:border-solid focus:border-neutral-900 dark:border-neutral-700"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                  </Field>
                );
              }}
            />

            {/* Image Banner */}
            <form.Field
              name="imageSrc"
              children={(field) => (
                <div className="space-y-2">
                  <span className="block text-[10px] tracking-widest text-neutral-400 uppercase">Banner Image</span>
                  {field.state.value ? (
                    <div className="relative border border-dashed border-neutral-300 p-2 dark:border-neutral-700 bg-background/50">
                      <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                        <img
                          src={field.state.value}
                          alt="Banner Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex gap-1.5 mt-2 font-mono text-[10px] items-center text-neutral-400">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setIsPickerOpen(true)}
                          className="h-7 rounded-none px-2 font-mono text-[9px] uppercase text-neutral-500 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          Change Image
                        </Button>
                        <span>|</span>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => field.handleChange("")}
                          className="h-7 rounded-none px-2 font-mono text-[9px] uppercase text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setIsPickerOpen(true)}
                      className="cursor-pointer border border-dashed border-neutral-300 hover:border-neutral-500 py-6 text-center text-neutral-400 dark:border-neutral-700 bg-background/50 flex flex-col items-center justify-center space-y-1.5"
                    >
                      <Plus className="size-4" />
                      <span className="font-mono text-[9px] uppercase tracking-wider">Select Banner Image</span>
                    </div>
                  )}

                  <MediaPickerDialog
                    open={isPickerOpen}
                    onOpenChange={setIsPickerOpen}
                    selectedUrl={field.state.value || ""}
                    onSelect={(url) => {
                      field.handleChange(url);
                      setIsPickerOpen(false);
                    }}
                  />
                </div>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <form.Field
                name="price"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name} className="text-[10px] tracking-widest text-neutral-400 uppercase">
                        Base Price (PHP)
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        disabled={isPending}
                        className="h-9 rounded-none border-dashed border-neutral-300 bg-background/50 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                    </Field>
                  );
                }}
              />

              {/* Delivery Time */}
              <form.Field
                name="deliveryTime"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name} className="text-[10px] tracking-widest text-neutral-400 uppercase">
                        Delivery Timeline
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isPending}
                        placeholder="e.g. 3 - 4 Weeks"
                        className="h-9 rounded-none border-dashed border-neutral-300 bg-background/50 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                    </Field>
                  );
                }}
              />
            </div>

            {/* Features list */}
            <div className="space-y-3 pt-2">
              <span className="block text-[10px] tracking-widest text-neutral-400 uppercase">Deliverables Checklist</span>

              <div className="flex gap-2">
                <Input
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  placeholder="Add custom deliverable..."
                  className="h-9 rounded-none border-dashed border-neutral-300 focus-visible:border-solid dark:border-neutral-700"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddFeature} className="h-9 w-9 rounded-none cursor-pointer p-0 shrink-0">
                  <Plus className="size-4" />
                </Button>
              </div>

              <div className="max-h-[160px] overflow-y-auto border border-dashed border-neutral-300 bg-background p-2.5 space-y-1.5 dark:border-neutral-700">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 border-b border-dashed border-neutral-100 pb-1.5 last:border-0 last:pb-0 dark:border-neutral-800">
                    <span className="truncate">{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-neutral-450 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Action buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-dashed border-neutral-300 dark:border-neutral-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/services")}
                disabled={isPending}
                className="h-9 rounded-none border-dashed font-mono text-[10px] uppercase"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="h-9 rounded-none bg-foreground font-mono text-[10px] text-background uppercase hover:bg-foreground/90">
                {isPending ? (
                  <>
                    <Loader2 className="mr-1.5 size-3.5 animate-spin" /> Staging Package...
                  </>
                ) : (
                  "Create Package"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Add-ons Visibility during creation */}
        <div className="border border-dashed border-neutral-300 bg-neutral-50/50 p-6 dark:border-neutral-700 dark:bg-neutral-900/40 space-y-6">
          <div className="border-b border-dashed border-neutral-300 pb-4 dark:border-neutral-700">
            <h2 className="font-sans text-sm font-bold tracking-widest text-foreground uppercase flex items-center gap-1.5">
              <Settings className="size-4" /> Add-on Upgrades
            </h2>
            <p className="font-mono text-[10px] text-neutral-400 uppercase mt-1">Configure optional package addons</p>
          </div>

          {/* Add-on Creator Inputs */}
          <div className="space-y-3 font-mono text-xs">
            <Field>
              <FieldLabel className="text-[9px] tracking-wider text-neutral-400 uppercase">Add-on Name</FieldLabel>
              <Input
                value={addonName}
                onChange={(e) => setAddonName(e.target.value)}
                placeholder="e.g. Extra Mobile Build"
                className="h-9 rounded-none border-dashed border-neutral-300 focus-visible:border-solid dark:border-neutral-700"
              />
            </Field>

            <Field>
              <FieldLabel className="text-[9px] tracking-wider text-neutral-400 uppercase">Add-on Price (PHP)</FieldLabel>
              <Input
                type="number"
                value={addonPrice}
                onChange={(e) => setAddonPrice(Number(e.target.value))}
                className="h-9 rounded-none border-dashed border-neutral-300 focus-visible:border-solid dark:border-neutral-700"
              />
            </Field>

            <Field>
              <FieldLabel className="text-[9px] tracking-wider text-neutral-400 uppercase">Add-on Description</FieldLabel>
              <textarea
                value={addonDesc}
                onChange={(e) => setAddonDesc(e.target.value)}
                placeholder="Brief description of the upgrade..."
                rows={2}
                className="w-full resize-none rounded-none border border-dashed border-neutral-300 bg-background/50 p-2 outline-none focus:border-solid focus:border-neutral-900 dark:border-neutral-700"
              />
            </Field>

            <Button
              type="button"
              onClick={handleAddAddon}
              className="w-full h-8 rounded-none font-mono text-[9px] uppercase tracking-wider"
            >
              <Plus className="mr-1.5 size-3.5" /> Add to Package
            </Button>
          </div>

          {/* Current Add-ons List */}
          <div className="space-y-2 pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-800">
            <span className="block font-mono text-[9px] text-neutral-400 uppercase">Staged Add-ons ({addOns.length})</span>
            {addOns.length === 0 ? (
              <div className="text-center py-6 text-neutral-400 font-mono text-[10px] border border-dashed border-neutral-350 dark:border-neutral-750">
                No optional upgrades configured yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {addOns.map((addon) => (
                  <div
                    key={addon.id}
                    className="border border-dashed border-neutral-300 bg-background p-2.5 relative group dark:border-neutral-700"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveAddon(addon.id)}
                      className="absolute top-2 right-2 text-neutral-450 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                    <div className="font-bold text-foreground pr-5 font-sans text-xs">{addon.name}</div>
                    <div className="text-[10px] text-neutral-500 font-mono mt-0.5">₱{addon.price.toLocaleString()}</div>
                    {addon.description && (
                      <p className="text-[10px] text-neutral-500 mt-1 font-sans leading-normal">{addon.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
