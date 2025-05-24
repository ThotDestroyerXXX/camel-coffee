export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className='bg-blue-600 w-full h-full'>
        <h1>hello</h1>
      </div>
      {children}
    </div>
  );
}
