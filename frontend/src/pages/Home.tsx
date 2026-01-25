import React from 'react';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import { RxChevronRight } from 'react-icons/rx';
import { useLanguage } from '../context/LanguageContext';

type ImageProps = {
  src: string;
  alt?: string;
};

type SectionProps = {
  image: ImageProps;
  heading: string;
  description: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  sections: SectionProps[];
  buttons: { title: string; variant?: string; size?: string; iconRight?: React.ReactNode }[];
};

const defaultProps: Props = {
  tagline: "Tagline",
  heading: "Alumni Club Mediteran",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  sections: [
    {
      image: {
        src:img1,
        alt: "Placeholder image 1",
      },
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    },
    {
      image: {
        src: img2,
        alt: "Placeholder image 2",
      },
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    },
    {
      image: {
        src: img3,
        alt: "Placeholder image 3",
      },
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    },
  ],
  buttons: [
    { title: "Button", variant: "secondary" },
    {
      title: "Button",
      variant: "link",
      size: "link",
      iconRight: <RxChevronRight />,
    },
  ],
};

const Home: React.FC<Partial<Props>> = (props) => {
  const { t } = useLanguage();
  
  const sections = [
    {
      image: {
        src: img1,
        alt: "Networking image",
      },
      heading: t('home.section1.heading'),
      description: t('home.section1.description'),
    },
    {
      image: {
        src: img2,
        alt: "Mentorship image",
      },
      heading: t('home.section2.heading'),
      description: t('home.section2.description'),
    },
    {
      image: {
        src: img3,
        alt: "Career development image",
      },
      heading: t('home.section3.heading'),
      description: t('home.section3.description'),
    },
  ];

  return (
    <div className="overflow-x-hidden max-w-full">
      <section className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="flex flex-col items-center">
            <div className="mb-12 text-center md:mb-18 lg:mb-20">
              <div className="w-full max-w-lg">
                <p className="mb-3 font-semibold md:mb-4">{t('home.tagline')}</p>
                <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                  {t('home.heading')}
                </h2>
                <p className="md:text-md">{t('home.description')}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 items-start justify-center gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12 max-[950px]:flex-col max-[950px]:items-center max-[950px]:w-[98vw] max-[950px]:gap-6">
              {sections?.map((section, index) => (
                <div
                  key={index}
                  className="flex w-full flex-col items-center text-center"
                >
                  <div className="mb-6 md:mb-8">
                    <img 
                      src={section.image.src} 
                      alt={section.image.alt} 
                      className="max-[950px]:w-[88vw] max-[950px]:min-w-[120px] max-[950px]:max-w-[250px]"
                    />
                  </div>
                  <h3 className="mb-5 text-2xl font-bold md:mb-6 md:text-3xl md:leading-[1.3] lg:text-4xl">
                    {section.heading}
                  </h3>
                  <p>{section.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Custom Read More Button with Tailwind */}
      <div className="flex justify-center items-center">
        <button className="group relative flex justify-center items-center border border-solid bg-[#ffab1f] text-white cursor-pointer font-black leading-6 m-0 p-0 transition-all duration-300 hover:bg-[#294a70] hover:text-white uppercase w-[300px] min-w-[180px] px-8 py-4 overflow-hidden">
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-white transition-all duration-200 ease-out group-hover:clip-path-none" 
               style={{
                 clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 100% 100%)',
               }}>
          </div>
          <div className="absolute inset-0 bg-white transition-all duration-200 ease-out group-hover:opacity-0"
               style={{
                 clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 100% 100%)',
               }}>
          </div>
          
          {/* Text container with animation */}
          <span className="block overflow-hidden relative">
            <span className="block font-black relative mix-blend-difference group-hover:animate-bounce">
              {t('home.readMore')}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Home;

