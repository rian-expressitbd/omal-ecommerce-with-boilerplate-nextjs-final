import React from "react";

export default function Title({ title }) {
  return (
    <div className='flex items-center justify-center w-full py-4'>
      <div className='flex-1 h-px bg-black'></div>
      <h2 className='px-4 text-2xl font-bold uppercase text-center'>{title}</h2>
      <div className='flex-1 h-px bg-black'></div>
    </div>
  );
}
