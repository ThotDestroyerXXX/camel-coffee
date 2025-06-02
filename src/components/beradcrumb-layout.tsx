import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbLayoutProps {
  list: {
    label: string;
    href?: string;
  }[];
}

export function BreadcrumbLayout({ list }: Readonly<BreadcrumbLayoutProps>) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {list.map((item) => (
          <div
            key={item.label}
            className='items-center flex flex-row gap-1.5 sm:gap-2.5 text-background'
          >
            <BreadcrumbItem key={item.label}>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage className='text-background'>
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {item.href && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
