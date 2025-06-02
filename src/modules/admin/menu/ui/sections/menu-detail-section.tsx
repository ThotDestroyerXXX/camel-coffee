"use client";

import { useIsMobile } from "@/hooks/use-mobile";

import { ReactNode } from "react";
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
  return (
    <>
      {!isMobile ? (
        <MenuDetailSheet item={item}>{children}</MenuDetailSheet>
      ) : (
        <MenuDetailDrawer item={item}>{children}</MenuDetailDrawer>
      )}
    </>
  );
}
