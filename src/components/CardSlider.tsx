import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface CardSliderProps {
  cards: React.ReactNode[];
}

export default function CardSlider({ cards }: CardSliderProps) {
  const finalCards =
    cards &&
    cards.length > 0 &&
    cards.map((card, index) => (
      <SwiperSlide
        key={index}
        className="flex justify-center px-2 py-4 h-auto"
      >
        <div className="w-full h-full max-w-[420px] md:max-w-[450px]">
          {card}
        </div>
      </SwiperSlide>
    ));

  return (
    <div className="w-full mx-auto relative group/slider">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        centeredSlides={true}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        speed={700}
        loop={true}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 1.5,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        className="relative mx-auto px-4"
      >
        {finalCards}
      </Swiper>

      <style>{`
        /* تأثير الزوم والشفافية للكارت النشط (Active Card Effect) */
        .swiper-slide {
          opacity: 0.4;
          transform: scale(0.9);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .swiper-slide-active {
          opacity: 1;
          transform: scale(1);
        }

        .swiper-button-next,
        .swiper-button-prev {
          color: #05568d !important;
          background: rgba(255, 255, 255, 0.9);
          backdrop-blur: md;
          width: 40px !important;
          height: 40px !important;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px border-slate-100;
          transition: all 0.3s ease;
          opacity: 0;
        }

        .group\/slider:hover .swiper-button-next,
        .group\/slider:hover .swiper-button-prev {
          opacity: 1;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: #05568d;
          color: #fff !important;
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 16px !important;
          font-weight: bold;
        }

        .swiper-pagination {
          bottom: -5px !important;
        }

        .swiper-pagination-bullet {
          background: rgba(5, 86, 141, 0.25) !important;
          opacity: 1 !important;
          width: 8px !important;
          height: 8px !important;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          background: #05568d !important;
          width: 24px !important;
          border-radius: 4px !important;
        }

        @media (max-width: 1024px) {
            .swiper-button-next,
            .swiper-button-prev {
            display: none !important;
          }
          .swiper-pagination-bullet {
            width: 6px !important;
            height: 6px !important;
          }
          .swiper-pagination-bullet-active {
            width: 18px !important;
          }
        }
      `}</style>
    </div>
  );
}
