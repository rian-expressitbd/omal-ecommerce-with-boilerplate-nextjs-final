import React from "react";

export default function CommonLayout({ children }) {
  return (
    <>
      <div className='mx-auto w-full md:w-[85%]'>{children}</div>
    </>
  );
}
