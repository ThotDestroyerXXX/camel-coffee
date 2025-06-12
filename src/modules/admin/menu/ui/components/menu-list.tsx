import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import MenuDetailSection from "../sections/menu-detail-section";
import { MenuCardProps } from "./menu-card";
import { Separator } from "@/components/ui/separator";

export default function MenuList({
  item,
  updateAvailability,
  disabled = false,
}: Readonly<MenuCardProps>) {
  return (
    <MenuDetailSection item={item}>
      <div key={item.item.id} className='p-4 gap-6 flex flex-row w-full h-full'>
        <Image
          src={item.item.image_url}
          alt='menu'
          width={120}
          height={120}
          className='size-30 object-cover object-center rounded-md shrink-0'
          loading='lazy'
        />
        <div className='flex flex-col justify-between w-full h-30'>
          <div className='flex flex-col gap-2'>
            <h3 className='text-lg/5 font-semibold tracking-tight capitalize max-sm:text-base/5 line-clamp-1'>
              {item.item.name}
            </h3>
            <p className='text-sm text-gray-600 max-sm:text-xs line-clamp-2'>
              {item.item.description}
            </p>
            <span className='text-sm text-gray-600'>
              ${parseFloat(item.item.price).toFixed(2)}
            </span>
          </div>
          <div className='flex items-center space-x-2 mt-auto'>
            <Switch
              id='is-available'
              name='is-available'
              defaultChecked={item.item.is_available}
              onClick={(e) => e.stopPropagation()}
              onCheckedChange={(checked) => {
                updateAvailability(item.item.id, checked);
              }}
              disabled={disabled}
            />
            <Label htmlFor='is-available' className='text-sm font-normal'>
              Is Available
            </Label>
          </div>
        </div>
      </div>
      <Separator />
    </MenuDetailSection>
  );
}
