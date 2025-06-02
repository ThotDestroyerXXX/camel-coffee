import EditMenuFormSection from "../sections/edit-menu-form-section";

export default function EditMenuView({ itemId }: Readonly<{ itemId: string }>) {
  return (
    <div className='flex flex-col gap-4 p-4'>
      <EditMenuFormSection itemId={itemId} />
    </div>
  );
}
