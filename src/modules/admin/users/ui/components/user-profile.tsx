import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import Image from "next/image";
import Dropzone from "react-dropzone";

interface UserProfileProps {
  loading: boolean;
  image: File | null;
  setImage: (image: File | null) => void;
}

export default function UserProfile({
  loading,
  image,
  setImage,
}: Readonly<UserProfileProps>) {
  return (
    <Dropzone
      accept={{ "image/*": [] }}
      multiple={false}
      maxFiles={1}
      maxSize={10 * 1024 * 1024} // 10MB
      disabled={loading}
    >
      {({ getRootProps, getInputProps }) => (
        <section className='flex flex-col items-center gap-4 bg-muted text-background p-6 rounded-md shadow-sm'>
          <h3 className='text-lg font-semibold'>Profile Photo</h3>
          <div
            {...getRootProps()}
            className={`size-30 items-center justify-center  ${
              image ? "hidden" : "flex"
            } flex-col gap-2 border-dashed border-2 rounded-full`}
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
            <Camera />
          </div>
          <div>
            {image && (
              <div className='flex flex-col items-center gap-2'>
                <Image
                  src={URL.createObjectURL(image)}
                  alt='Preview'
                  className='object-cover object-center size-30 rounded-full'
                  width={100}
                  height={100}
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
  );
}
