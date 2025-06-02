"use client";
import { BreadcrumbLayout } from "@/components/beradcrumb-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TypeSelect } from "../components/type-select";
import { drinkTypeEnum, itemTypeEnum } from "@/db/schema";
import { Suspense, useState } from "react";
import { trpc } from "@/trpc/client";
import VariationCheckbox from "../components/variation-checkbox";
import Dropzone from "react-dropzone";
import Image from "next/image";
import { MenuFormSkeleton } from "../components/menu-form-skeleton";
import { UpdateHandler } from "../../handlers/update-handler";
import { ErrorBoundary } from "react-error-boundary";
import NotFound from "@/components/not-found";

const breadCrumbList = [
  { label: "Admin", href: "/admin" },
  { label: "Menu", href: "/admin/menu" },
  { label: "Edit Item" },
];

export default function EditMenuFormSection({
  itemId,
}: Readonly<{ itemId: string }>) {
  return (
    <Suspense fallback={<MenuFormSkeleton />}>
      <ErrorBoundary fallback={<NotFound message='Internal Server Error' />}>
        <EditMenuFormSectionSuspense itemId={itemId} />
      </ErrorBoundary>
    </Suspense>
  );
}

function EditMenuFormSectionSuspense({ itemId }: Readonly<{ itemId: string }>) {
  const [itemData] = trpc.menu.getOne.useSuspenseQuery({ itemId: itemId });
  const [data] = trpc.drinkOption.getMany.useSuspenseQuery();
  const [itemType, setItemType] = useState<string | null>(itemData.item.type);
  const [image, setImage] = useState<File | string | null>(
    itemData.item.image_url
  );
  const [loading, setLoading] = useState(false);

  const { OnSubmit } = UpdateHandler(setLoading);

  return (
    <form
      onSubmit={(e) => {
        OnSubmit({
          e,
          image,
          data,
          image_url: itemData.item.image_url,
          item_id: itemId,
        });
      }}
    >
      <div className='flex flex-col gap-4'>
        <section className='flex flex-row flex-wrap justify-between items-center bg-muted shadow-md rounded-md p-4 gap-4 sticky top-4 z-10'>
          <div className='flex flex-col gap-1 text-background flex-shrink-0'>
            <h2 className='text-2xl font-semibold tracking-tighter'>
              Add Item
            </h2>
            <BreadcrumbLayout list={breadCrumbList} />
          </div>
          <div className='flex flex-row gap-4 flex-shrink-0 max-md:w-full max-md:justify-end'>
            <Button
              variant='destructive'
              className='max-md:flex-1 max-md:w-auto'
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant='outline'
              className='max-md:flex-1 max-md:w-auto'
              disabled={loading}
            >
              Add Item
            </Button>
          </div>
        </section>
        <div className='flex gap-4 justify-between flex-wrap flex-row-reverse'>
          <div className='min-w-[300px] max-md:w-full gap-4 flex flex-col'>
            <section className='flex flex-col gap-4 p-4 shadow-md rounded-md'>
              <div className='flex flex-col gap-4'>
                <h3 className='text-xl tracking-tighter font-semibold'>
                  Product Media
                </h3>
                <Separator />

                <Dropzone
                  accept={{ "image/*": [] }}
                  multiple={false}
                  maxFiles={1}
                  maxSize={10 * 1024 * 1024} // 10MB
                  disabled={loading}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div
                        {...getRootProps()}
                        className={`w-full h-[280px] items-center justify-center ${
                          image ? "hidden" : "flex"
                        } flex-col gap-2 border-dashed border-2 rounded-md`}
                      >
                        <Input
                          {...getInputProps()}
                          name='media'
                          type='file'
                          disabled={loading}
                          onChange={(e) => {
                            setImage(e.target.files?.[0] ?? null);
                          }}
                        />
                        <Label htmlFor='media'>Add Image</Label>
                      </div>
                      <div>
                        {image && (
                          <div className='flex flex-col items-center gap-2'>
                            <Image
                              src={
                                image instanceof File
                                  ? URL.createObjectURL(image)
                                  : image
                              }
                              alt='Preview'
                              className='w-full max-w-[280px] h-[280px] object-cover object-center rounded-md'
                              width={280}
                              height={280}
                            />
                            <Button
                              variant='destructive'
                              className='w-full max-w-[280px]'
                              onClick={() => setImage(null)}
                              disabled={loading}
                            >
                              Remove Image
                            </Button>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
            </section>
            <section>
              <div className='flex flex-col gap-4 p-4 shadow-md rounded-md'>
                <h3 className='text-xl tracking-tighter font-semibold'>Type</h3>
                <Separator />
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='item-type'>Item Type</Label>
                  <TypeSelect
                    value={itemTypeEnum.enumValues}
                    onChange={setItemType}
                    name='item-type'
                    disabled={loading}
                    defaultValue={itemData.item.type}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='drink-type'>Drink Type</Label>
                  <TypeSelect
                    value={drinkTypeEnum.enumValues}
                    disabled={itemType !== "drink" || loading}
                    name='drink-type'
                    defaultValue={itemData.item.drink_type ?? undefined}
                  />
                </div>
              </div>
            </section>
          </div>
          <div className='max-md:w-full flex-1 gap-4 flex flex-col'>
            <section className='flex flex-col gap-4 p-4 shadow-md rounded-md'>
              <div className='flex flex-col gap-4'>
                <h3 className='text-xl tracking-tighter font-semibold'>
                  General Information
                </h3>
                <Separator />
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='name'>Name</Label>
                  <Input
                    type='text'
                    id='name'
                    name='name'
                    disabled={loading}
                    defaultValue={itemData.item.name}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='description'>Description</Label>
                  <Textarea
                    id='description'
                    name='description'
                    disabled={loading}
                    defaultValue={itemData.item.description}
                  />
                </div>
              </div>
            </section>
            <section>
              <div className='flex flex-col gap-4 p-4 shadow-md rounded-md '>
                <h3 className='text-xl tracking-tighter font-semibold'>
                  Pricing
                </h3>
                <Separator />
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='price'>Price</Label>
                  <Input
                    type='text'
                    id='price'
                    name='price'
                    disabled={loading}
                    defaultValue={itemData.item.price}
                  />
                </div>
              </div>
            </section>
            {itemType === "drink" && (
              <section>
                <div className='flex flex-col gap-4 p-4 shadow-md rounded-md'>
                  <h3 className='text-xl tracking-tighter font-semibold'>
                    Variation
                  </h3>
                  <Separator />
                  <div className='flex flex-col gap-4'>
                    {data.map((data) => (
                      <div key={data.id} className='flex flex-col gap-2'>
                        <Label className='text-base'>{data.name}</Label>
                        <VariationCheckbox
                          value={data.values}
                          disabled={false}
                          defaultValues={itemData.item_drink_options
                            .filter(
                              (opt) => opt.drink_option_type.id === data.id
                            )
                            .flatMap((opt) =>
                              opt.drink_option_values.map(
                                (val) => val.drink_option_value.id
                              )
                            )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
