"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Loading from "./loading";

interface ConfirmationDialogProps {
  triggerText: string;
  title: string;
  description: string;
  actionText: string;
  cancelText: string;
  onAction: () => Promise<void>;
}

export function ConfirmationDialog({
  triggerText,
  title,
  description,
  actionText,
  cancelText,
  onAction,
}: Readonly<ConfirmationDialogProps>) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <Loading />}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant='outline'>{triggerText}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  await onAction();
                } catch (error) {
                  console.error("Action failed:", error);
                }
              }}
              disabled={loading}
            >
              {actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
