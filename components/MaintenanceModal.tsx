"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function MaintenanceModal() {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scheduled Maintenance</DialogTitle>
          <DialogDescription>
            Our website is currently undergoing maintenance to improve your experience. You can continue to browse, but some features may be temporarily unavailable.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            onClick={handleClose}
            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white hover:opacity-90 transition"
          >
            Continue
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
