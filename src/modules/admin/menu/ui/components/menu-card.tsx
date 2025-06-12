import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import MenuDetailSection from "../sections/menu-detail-section";

export interface MenuCardProps {
  item: {
    item: {
      drink_type: "coffee" | "non-coffee" | null;
      id: string;
      name: string;
      created_at: Date;
      updated_at: Date;
      description: string;
      price: string;
      type: "food" | "drink";
      image_url: string;
      is_available: boolean;
    };
    item_drink_options: {
      drink_option_type: {
        id: number;
        name: string;
        created_at: Date;
        updated_at: Date;
      };
      drink_option_values: {
        item_drink_option: {
          id: number;
          item_id: string;
          drink_option_value_id: number;
        };
        drink_option_value: {
          id: number;
          name: string;
          drink_option_type_id: number;
          additional_price: string;
        };
      }[];
    }[];
  };

  updateAvailability: (itemId: string, isAvailable: boolean) => void;
  disabled?: boolean;
}

export default function MenuCard({
  item,
  updateAvailability,
  disabled = false,
}: Readonly<MenuCardProps>) {
  return (
    <MenuDetailSection item={item}>
      <div
        key={item.item.id}
        className='p-4 border-muted border-2 gap-2 rounded-md flex flex-col hover:shadow-lg transition-shadow duration-200 w-[15rem] max-sm:w-[10rem] h-[23rem]'
      >
        <Image
          src={item.item.image_url}
          alt='menu'
          width={400}
          height={400}
          className='w-full aspect-square object-cover object-center rounded-md mb-2'
          loading='lazy'
        />
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg/5 font-semibold tracking-tight capitalize max-sm:text-base/5'>
            {item.item.name}
          </h3>
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
    </MenuDetailSection>
  );
}
