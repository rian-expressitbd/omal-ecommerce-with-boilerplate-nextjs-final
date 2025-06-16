type CommonLayoutProps = {
  children: React.ReactNode;
};

const CommonLayout = ({ children }: CommonLayoutProps) => {
  return <div className='mx-auto w-full md:w-[85%]'>{children}</div>;
};

export default CommonLayout;
