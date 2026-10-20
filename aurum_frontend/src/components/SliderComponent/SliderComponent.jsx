import React from 'react';
import Slider from 'react-slick';

const SliderComponent = ({ arrImages }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
  };

  return (
    <div className='rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5'>
      <Slider {...settings}>
        {arrImages.map((image, index) => (
          <div key={index}>
            <img src={image} alt='slider' className='w-full h-[200px] sm:h-[300px] lg:h-[400px] object-cover block' />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;
