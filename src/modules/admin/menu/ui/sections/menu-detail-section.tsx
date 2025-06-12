"use client";

import { useIsMobile } from "@/hooks/use-mobile";

import { ReactNode, useState } from "react";
import MenuDetailSheet from "../components/menu-detail-sheet";
import MenuDetailDrawer from "../components/menu-detail-drawer";

export interface MenuDetailSectionProps {
  children?: ReactNode;
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

  isLoading?: boolean;
}

export default function MenuDetailSection({
  children,
  item,
}: Readonly<MenuDetailSectionProps>) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Clickable wrapper element */}
      <div onClick={handleOpen}>{children}</div>

      {/* Only render details when open */}
      {isOpen && (
        <>
          {!isMobile ? (
            <MenuDetailSheet
              item={item}
              isOpen={isOpen}
              onClose={handleClose}
            />
          ) : (
            <MenuDetailDrawer
              item={item}
              isOpen={isOpen}
              onClose={handleClose}
            />
          )}
        </>
      )}
    </>
  );
}
