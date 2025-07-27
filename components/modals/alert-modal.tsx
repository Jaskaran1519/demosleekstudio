"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title?: string;
  description?: string;
}

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = "Are you sure?",
  description = "This action cannot be undone."
}: AlertModalProps) => {
  // Simple implementation without complex focus management
  // The Modal component from shadcn/ui already handles accessibility
  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button 
          disabled={loading} 
          variant="outline" 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          disabled={loading} 
          variant="destructive" 
          onClick={onConfirm}
          className="ml-2"
        >
          {loading ? "Loading..." : "Continue"}
        </Button>
      </div>
    </Modal>
  );
};