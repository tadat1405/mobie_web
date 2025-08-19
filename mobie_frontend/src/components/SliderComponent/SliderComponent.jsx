import { Image } from 'antd';
import React from 'react';
import Slider from 'react-slick';
import './SliderComponent.scss'; // Nhớ import file SCSS

const SliderComponent = ({ arrImages }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="slider-wrapper">
      <Slider {...settings}>
        {arrImages.map((image, index) => (
          <div key={index}>
            <Image
              src={image}
              alt="slider"
              preview={false}
              width="100%"
              style={{ height: '400px', objectFit: 'cover' }} // Tuỳ bạn điều chỉnh
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;
