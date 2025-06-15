"use client";
import Image from "next/image";
import React from "react";
import Slider from "react-slick";
import CommonLayout from "@/app/layouts/CommonLayout";
import Button from "../ui/Button";

export default function Banner() {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className='mt-5'>
      <Slider {...settings}>
        <div className='w-full relative'>
          <div className='absolute inset-0 bg-black/50  z-10'></div>
          <CommonLayout>
            <div className='absolute top-1/2 transform -translate-y-1/2 lg:w-1/3 w-[275px] p-3 md:p-0 z-20'>
              <h1 className='text-white text-7xl font-semibold'>
                Save Up To 40%
              </h1>
              <p className='text-sm text-white mt-3 text-left md:text-justify'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Sapiente dolorem quidem illo, fugiat quis quisquam suscipit
                laboriosam blanditiis praesentium reiciendis velit dignissimos
                voluptatum illum, itaque cumque dicta tempora! Fugit, unde
              </p>
              <div className='mt-8'>
                <Button className='bg-purple-700 text-white'>Shop Now</Button>
              </div>
            </div>
          </CommonLayout>

          <Image
            src='/assets/banner1.jpg'
            alt='slider_img_one'
            width={1080}
            height={720}
            className='h-[800px] w-full object-cover'
          />
        </div>

        <div className='w-full relative'>
          {/* Dark overlay div */}
          <div className='absolute inset-0 bg-black/50  z-10'></div>

          <CommonLayout>
            <div className='absolute top-1/2 transform -translate-y-1/2 lg:w-1/3 w-[275px] z-20'>
              <h1 className='text-white text-7xl font-semibold'>
                Save Up To 40%
              </h1>
              <p className='text-sm text-white mt-3 text-left md:text-justify'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Sapiente dolorem quidem illo, fugiat quis quisquam suscipit
                laboriosam blanditiis praesentium reiciendis velit dignissimos
                voluptatum illum, itaque cumque dicta tempora! Fugit, unde
              </p>
              <div className='mt-8'>
                <Button className='bg-purple-700 text-white'>Shop Now</Button>
              </div>
            </div>
          </CommonLayout>

          <Image
            src='/assets/banner2.jpg'
            alt='slider_img_two'
            width={1080}
            height={720}
            className='h-[800px] w-full object-cover'
          />
        </div>
      </Slider>
    </div>
  );
}
