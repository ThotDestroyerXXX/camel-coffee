import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Phone, ShieldUser, User } from "lucide-react";
import RoleSelect from "./role-select";
import "react-phone-input-2/lib/plain.css";
import PhoneInputComponent from "@/components/phone-input";

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
              name='name'
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
              name='email'
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
          <Input
            id='password'
            type='password'
            name='password'
            disabled={loading}
          />
        </div>
        <div className='flex flex-col flex-1 gap-2'>
          <Label htmlFor='phone_number'>
            <Phone className='w-4' />
            Phone Number
          </Label>
          <PhoneInputComponent disabled={loading} />
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
