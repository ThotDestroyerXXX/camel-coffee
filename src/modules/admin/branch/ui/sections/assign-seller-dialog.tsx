"use client";
import NotFound from "@/components/not-found";
import { trpc } from "@/trpc/client";
import { Suspense, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SellerCombobox } from "../components/seller-combobox";
import { AssignSellerHandler } from "../../handlers/branch-handler";

interface AssignSellerProps {
  branchId: string;
  branchName: string;
}

export default function AssignSellerDialog({
  branchId,
  branchName,
}: Readonly<AssignSellerProps>) {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center h-full'>
          <p>Loading...</p>
        </div>
      }
    >
      <ErrorBoundary fallback={<NotFound message='Internal Server Error' />}>
        <AssignSellerDialogSuspense
          branchId={branchId}
          branchName={branchName}
        />
      </ErrorBoundary>
    </Suspense>
  );
}

function AssignSellerDialogSuspense({
  branchId,
  branchName,
}: Readonly<AssignSellerProps>) {
  const [loading, setLoading] = useState(false);
  const [data] = trpc.branch.getUnassignedSellers.useSuspenseQuery();
  const sellerRef = useRef<string | undefined>(undefined);
  const { handleAssignSeller } = AssignSellerHandler(setLoading);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Assign Seller</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] '>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAssignSeller({
              branchId,
              sellerId: sellerRef.current ?? "",
            });
          }}
          className='flex flex-col gap-4'
        >
          <DialogHeader>
            <DialogTitle>Assign Seller</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4'>
            <div className='grid gap-3'>
              <Label htmlFor='branch'>Branch</Label>
              <Input
                id='branch'
                name='branch'
                defaultValue={branchName}
                disabled
              />
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='seller'>Seller</Label>
              <SellerCombobox
                data={data}
                valueRef={sellerRef}
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit'>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
