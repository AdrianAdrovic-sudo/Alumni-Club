import React from 'react';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import { RxChevronRight } from 'react-icons/rx';
import '../css/Home.css';

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
  const { tagline, heading, description, sections, buttons } = {
    ...defaultProps,
    ...props,
  };

  return (
    <main className="home-main-content">
      <section className="layout239-section px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="flex flex-col items-center">
            <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
              <div className="w-full max-w-lg">
                <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
                <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                  {heading}
                </h2>
                <p className="md:text-md">{description}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 items-start justify-center gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
              {sections?.map((section, index) => (
                <div
                  key={index}
                  className="flex w-full flex-col items-center text-center"
                >
                  <div className="rb-6 mb-6 md:mb-8">
                    <img src={section.image.src} alt={section.image.alt} />
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
      <button className="btn-31">
        <span className="text-container">
          <span className="text">Read more...</span>
        </span>
      </button>
    </main>
  );
};

export default Home;

