import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Phone, ShieldUser, User } from "lucide-react";
import RoleSelect from "./role-select";
import PhoneInput from "react-phone-input-2";
import { cn } from "@/lib/utils";
import "react-phone-input-2/lib/plain.css";

export default function UserInformation({
  loading,
}: Readonly<{ loading: boolean }>) {
  return (
    <section className='flex flex-col max-w-[30rem] h-full w-full gap-4 border-2 rounded-md shadow-sm '>
      <div className='bg-muted p-4 text-background'>
        <h3 className='text-lg font-semibold'>User Information</h3>
      </div>
      <div className='p-4 flex flex-col gap-4 max-sm:text-sm'>
        <div className='flex flex-row max-[500px]:flex-col gap-4'>
          <div className='flex flex-col flex-1 gap-2'>
            <Label htmlFor='name'>
              <User className='w-4' />
              Full Name
            </Label>
            <Input
              id='name'
              type='text'
              placeholder='full name'
              disabled={loading}
            />
          </div>
          <div className='flex flex-col flex-1 gap-2'>
            <Label htmlFor='email'>
              <Mail className='w-4' />
              Email
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='m@example.com'
              disabled={loading}
            />
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-2'>
          <Label htmlFor='password'>
            <Lock className='w-4' />
            Password
          </Label>
          <Input id='password' type='password' disabled={loading} />
        </div>
        <div className='flex flex-col flex-1 gap-2'>
          <Label htmlFor='email'>
            <Phone className='w-4' />
            Phone Number
          </Label>
          <PhoneInput
            buttonClass={"rounded-md"}
            inputClass={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
            )}
            countryCodeEditable={false}
            country={"id"}
            disableSearchIcon
            autoFormat={false}
            specialLabel=''
            inputProps={{
              name: "phone_number",
            }}
            enableSearch
            copyNumbersOnly
            disabled={loading}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='role'>
            <ShieldUser className='w-4' />
            User Role
          </Label>
          <RoleSelect disabled={loading} />
        </div>
      </div>
    </section>
  );
}
