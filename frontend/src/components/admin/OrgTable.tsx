"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MoreHorizontal, ExternalLink, ShieldAlert } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface Organization {
  id: number;
  name: string;
  clerk_org_id: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  is_active: boolean;
  generations_used_this_month: number;
  monthly_generation_limit: number;
  usage_pct: number;
  cost_usd_this_month: string;
  owner_email: string;
  created_at: string;
}

interface OrgTableProps {
  data: Organization[];
  onViewDetail: (org: Organization) => void;
  onRefresh: () => void;
}

export function OrgTable({ data, onViewDetail, onRefresh }: OrgTableProps) {
  const columns: ColumnDef<Organization>[] = [
    {
      accessorKey: "name",
      header: "Organization",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{row.original.name}</span>
          <span className="text-xs text-gray-500 font-mono">
            {row.original.clerk_org_id}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => {
        const plan = row.original.plan;
        const variants: Record<string, any> = {
          free: "outline",
          starter: "secondary",
          pro: "default",
          enterprise: "default",
        };
        return (
          <Badge variant={variants[plan] || "default"} className="capitalize">
            {plan}
          </Badge>
        );
      },
    },
    {
      accessorKey: "usage",
      header: "Monthly Usage",
      cell: ({ row }) => {
        const used = row.original.generations_used_this_month;
        const limit = row.original.monthly_generation_limit;
        const pct = row.original.usage_pct;
        
        return (
          <div className="flex flex-col gap-1 w-32">
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>{used} / {limit}</span>
              <span className={pct >= 90 ? "text-red-600 font-semibold" : ""}>{pct}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${pct >= 90 ? 'bg-red-500' : 'bg-indigo-600'}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? "secondary" : "destructive"}>
          {row.original.is_active ? "Active" : "Suspended"}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {format(new Date(row.original.created_at), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const org = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onViewDetail(org)}>
                View Detail
              </DropdownMenuItem>
              <DropdownMenuItem>
                Copy Clerk ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <ShieldAlert className="mr-2 h-4 w-4" />
                {org.is_active ? "Suspend Org" : "Activate Org"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable 
        columns={columns} 
        data={data} 
        emptyMessage="No organizations matching your filters." 
      />
    </div>
  );
}
