import { BreadcrumbLayout } from "@/components/beradcrumb-layout";
import UserTableSection from "../sections/user-table-section";

const breadCrumbList = [{ label: "Admin", href: "/admin" }, { label: "Users" }];

export default function UserView() {
  return (
    <div className='flex flex-col gap-4 p-4'>
      <section className='flex flex-col flex-wrap bg-muted shadow-md rounded-md p-4 gap-4 sticky top-4 z-10'>
        <div className='flex flex-col gap-1 text-background flex-shrink-0'>
          <h2 className='text-2xl font-semibold tracking-tighter max-sm:text-xl'>
            Users
          </h2>
          <BreadcrumbLayout list={breadCrumbList} />
        </div>
      </section>
      <UserTableSection />
    </div>
  );
}
