"use client";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { RegisterHandler } from "../../handlers/register-handler";
import Loading from "@/components/loading";
import GoogleIcon from "@/components/ui/google";
import MicrosoftIcon from "@/components/ui/microsoft";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const { OnSubmit } = RegisterHandler(setLoading);
  return (
    <>
      {loading && <Loading />}
      <form
        onSubmit={(e) => {
          OnSubmit(e);
        }}
        className='bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]'
      >
        <div className='bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6'>
          <div className='text-center'>
            <Link href='/' aria-label='go home' className='mx-auto block w-fit'>
              <Coffee className='size-6' />
            </Link>
            <h1 className='text-title mb-1 mt-4 text-xl font-semibold'>
              Create a Tailark Account
            </h1>
            <p className='text-sm'>Welcome! Create an account to get started</p>
          </div>

          <div className='mt-6 space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='name' className='block text-sm'>
                Full Name
              </Label>
              <Input type='text' name='name' id='name' />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email' className='block text-sm'>
                Email
              </Label>
              <Input type='text' id='email' name='email' />
            </div>

            <div className='space-y-0.5'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='pwd' className='text-title text-sm'>
                  Password
                </Label>
                <Button asChild variant='link' size='sm'>
                  <Link
                    href='#'
                    className='link intent-info variant-ghost text-sm'
                  >
                    Forgot your Password ?
                  </Link>
                </Button>
              </div>
              <Input
                type='password'
                name='password'
                id='pwd'
                className='input sz-md variant-mixed'
              />
            </div>

            <Button className='w-full' type='submit'>
              Sign In
            </Button>
          </div>

          <div className='my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3'>
            <hr className='border-dashed' />
            <span className='text-muted-foreground text-xs'>
              Or continue With
            </span>
            <hr className='border-dashed' />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <Button type='button' variant='outline'>
              <GoogleIcon />
              <span>Google</span>
            </Button>
            <Button type='button' variant='outline'>
              <MicrosoftIcon />
              <span>Microsoft</span>
            </Button>
          </div>
        </div>

        <div className='p-3'>
          <p className='text-primary-foreground text-center text-sm'>
            Have an account ?
            <Button
              asChild
              variant='link'
              className='px-2 text-primary-foreground'
            >
              <Link href='/login'>Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </>
  );
}
