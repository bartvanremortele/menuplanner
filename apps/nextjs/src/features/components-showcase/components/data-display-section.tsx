"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { DL } from "@/components/ui/description-list";
import { DetailHeader } from "@/components/ui/detail-header";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ComponentExample } from "./component-example";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
];

export function DataDisplaySection() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Table */}
      <ComponentExample
        title="Table"
        description="A responsive table component for displaying tabular data."
      >
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invoice.paymentStatus === "Paid"
                        ? "default"
                        : invoice.paymentStatus === "Pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {invoice.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell className="text-right">
                  {invoice.totalAmount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ComponentExample>

      {/* Tabs */}
      <ComponentExample
        title="Tabs"
        description="A set of layered sections of content—known as tab panels—that are displayed one at a time."
      >
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Account Settings</h4>
              <p className="text-sm text-muted-foreground">
                Make changes to your account here. Click save when you're done.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="password" className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Password Settings</h4>
              <p className="text-sm text-muted-foreground">
                Change your password here. After saving, you'll be logged out.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="team" className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Team Settings</h4>
              <p className="text-sm text-muted-foreground">
                Manage your team members and their roles here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </ComponentExample>

      {/* Description List */}
      <ComponentExample
        title="Description List"
        description="A list of terms and their corresponding descriptions."
      >
        <div className="max-w-2xl">
          <DL>
            <DL.Item term="Full Name">John Doe</DL.Item>
            <DL.Item term="Email Address">john.doe@example.com</DL.Item>
            <DL.Item term="Role">
              <Badge>Administrator</Badge>
            </DL.Item>
            <DL.Item term="About">
              Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
              incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
              consequat sint. Sit id mollit nulla mollit nostrud in ea officia
              proident.
            </DL.Item>
            <DL.Item term="Attachments">
              <ul className="divide-y divide-border rounded-md border">
                <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                  <div className="flex w-0 flex-1 items-center">
                    <span className="ml-2 w-0 flex-1 truncate">
                      resume_back_end_developer.pdf
                    </span>
                  </div>
                </li>
                <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                  <div className="flex w-0 flex-1 items-center">
                    <span className="ml-2 w-0 flex-1 truncate">
                      coverletter_back_end_developer.pdf
                    </span>
                  </div>
                </li>
              </ul>
            </DL.Item>
          </DL>
        </div>
      </ComponentExample>

      {/* Detail Header */}
      <ComponentExample
        title="Detail Header"
        description="A header component for detail pages."
      >
        <div className="max-w-2xl">
          <DetailHeader
            title="Project Alpha"
            subtitle="A cutting-edge web application for modern businesses"
          />
        </div>
      </ComponentExample>

      {/* Delete Dialog */}
      <ComponentExample
        title="Delete Dialog"
        description="A confirmation dialog for delete actions."
      >
        <div className="flex items-center gap-4">
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Item
          </Button>
          <span className="text-sm text-muted-foreground">
            Click to see the delete confirmation dialog
          </span>
        </div>
        <DeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={() => {
            console.log("Item deleted");
            setDeleteDialogOpen(false);
          }}
          itemName="Important Document"
        />
      </ComponentExample>
    </div>
  );
}
