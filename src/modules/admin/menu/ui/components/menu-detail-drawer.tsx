import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MenuDetailSectionProps } from "../sections/menu-detail-section";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function MenuDetailDrawer({
  children,
  item,
}: Readonly<MenuDetailSectionProps>) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Menu Detail</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className='pr-12 pl-12 gap-2 flex flex-col overflow-auto'>
          <Image
            src={item.item.image_url}
            alt='menu'
            width={400}
            height={400}
            className='w-full aspect-square object-cover object-center rounded-md mb-2 border-2 border-muted'
            loading='lazy'
          />
          <div className='flex flex-col gap-2'>
            <h3 className='text-lg/5 font-semibold tracking-tight capitalize max-sm:text-base/5'>
              {item.item.name}
            </h3>
            <span className='text-sm text-gray-600'>
              ${parseFloat(item.item.price).toFixed(2)}
            </span>
            <p className='text-sm'>{item.item.description}</p>
            <div className='flex flex-col gap-2'>
              {item.item_drink_options.map((option) => (
                <div
                  className='flex flex-col gap-1'
                  key={option.drink_option_type?.id}
                >
                  <Label className='text-sm font-medium'>
                    {option.drink_option_type?.name}
                  </Label>
                  <div className='flex flex-row flex-wrap gap-2'>
                    {option.drink_option_values.map((value) => (
                      <Badge
                        key={value.drink_option_value?.id}
                        className='text-sm font-normal px-4 py-2'
                        variant={"outline"}
                      >
                        {value.drink_option_value?.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Link href={`/admin/menu/edit/${item.item.id}`}>
              <Button variant='default' className='w-full'>
                Edit
              </Button>
            </Link>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
