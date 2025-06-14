import BranchDetailSection from "../sections/branch-detail-section";

export default function BranchDetailView({
  branchId,
}: Readonly<{ branchId: string }>) {
  return (
    <div className='flex flex-col gap-4 p-4'>
      <BranchDetailSection branchId={branchId} />
    </div>
  );
}
