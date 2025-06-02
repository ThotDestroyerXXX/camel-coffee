import { Input } from "@/components/ui/input";

export default function MenuSearch({
  setSearch,
}: Readonly<{
  setSearch: (value: string) => void;
}>) {
  return (
    <div className='flex items-center gap-2 w-full'>
      <Input
        type='text'
        placeholder='Search menu...'
        onChange={(e) => setSearch(e.target.value)}
        className='w-full max-sm:text-sm p-2 bg-background rounded-md border border-muted focus:outline-none focus:ring-2 focus:ring-primary'
      />
    </div>
  );
}
