import { Input } from "@/components/ui/input";
import { memo, useCallback } from "react";
import { DebouncedState } from "use-debounce";

// Memoize the component to prevent unnecessary re-renders
const MenuSearch = memo(function MenuSearch({
  setSearch,
}: Readonly<{
  setSearch: DebouncedState<(value: string) => void>;
}>) {
  // Memoize the onChange handler
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [setSearch]
  );

  return (
    <div className='flex items-center gap-2 w-full'>
      <Input
        type='text'
        placeholder='Search menu...'
        onChange={handleChange}
        className='w-full max-sm:text-sm p-2 bg-background rounded-md border border-muted focus:outline-none focus:ring-2 focus:ring-primary'
      />
    </div>
  );
});

export default MenuSearch;
