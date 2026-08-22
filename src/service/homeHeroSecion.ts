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
      "w-[130px] h-[130px] md:w-36 md:h-36 lg:w-[200px] lg:h-[200px] object-cover rounded-full absolute top-0 left-[205px] lg:left-[470px] transform -translate-x-1/2 z-20",
  },

  {
    src: "",
    alt: "Team 2",
    className:
      "w-[130px] h-[130px] md:w-36 md:h-36 lg:w-[200px] lg:h-[200px] object-cover rounded-full absolute bottom-0 left-[205px] lg:left-[350px] transform -translate-x-1/2 z-20",
  },
  {
    src: "",
    alt: "Team 3",
    className:
      "w-[130px] h-[130px] md:w-36 md:h-36 lg:w-[200px] lg:h-[200px] object-cover rounded-full absolute top-1/2 left-[10px] lg:left-[0px] transform -translate-y-1/2 z-20",
  },
  {
    src: "",
    alt: "bubble1",
    className:
      "absolute lg:bottom-[-100px] lg:right-[90px] lg:-translate-y-[20%] bottom-[120px] left-[-10px] w-[250px] sm:w-434 lg:w-[350px] rotate-[43.61deg]",
  },
  {
    src: "",
    alt: "bubble2",
    className:
      "absolute lg:top-[200px] lg:left-[206px] lg:-translate-y-[30%] w-[250px] sm:w-[350px] lg:w-601.6 rotate-[151.52deg]",
  },
];
