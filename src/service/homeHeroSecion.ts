import { throwIfNotOk } from "../lib/apiError";

interface HomePageData {
  home_images: { image: { asset: { url: string } } }[];
}

export interface HeroSectionImage {
  src: string;
  alt: string;
  className: string;
}

export const getHomePageData = async (): Promise<HeroSectionImage[]> => {
  const res = await fetch(`/api/v1/home`);
  await throwIfNotOk(res);
  const json = await res.json();
  return fillTheArray(json.data);
};

const fillTheArray = (homeHeroImages: HomePageData) => {
  return heroSection.map((item, index) => {
    if (index < homeHeroImages?.home_images?.length) {
      item.src = homeHeroImages?.home_images[index].image.asset.url;
    }
    return item;
  });
};

const heroSection = [
  {
    src: "",
    alt: "Team 1",
    className:
      "w-[130px] h-[130px] md:w-36 md:h-36 lg:w-[200px] lg:h-[200px] object-cover rounded-full absolute top-0 left-[205px] lg:left-[470px] transform -translate-x-1/2 z-20 animate-hero-1",
  },

  {
    src: "",
    alt: "Team 2",
    className:
      "w-[130px] h-[130px] md:w-36 md:h-36 lg:w-[200px] lg:h-[200px] object-cover rounded-full absolute bottom-0 left-[205px] lg:left-[350px] transform -translate-x-1/2 z-20 animate-hero-2",
  },
  {
    src: "",
    alt: "Team 3",
    className:
      "w-[130px] h-[130px] md:w-36 md:h-36 lg:w-[200px] lg:h-[200px] object-cover rounded-full absolute top-1/2 left-[10px] lg:left-[0px] transform -translate-y-1/2 z-20 animate-hero-3",
  },
  {
    src: "",
    alt: "bubble1",
    className:
      "absolute lg:bottom-[calc(-100px+20%)] lg:right-[90px] bottom-[120px] left-[-10px] w-[250px] lg:w-[350px] rotate-[43.61deg] animate-bg-bubble-1",
  },
  {
    src: "",
    alt: "bubble2",
    className:
      "absolute lg:top-[calc(200px-30%)] lg:left-[206px] w-[250px] sm:w-[350px] rotate-[151.52deg] animate-bg-bubble-2",
  },
];
