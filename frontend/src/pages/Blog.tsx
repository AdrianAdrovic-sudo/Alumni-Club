import React, { useState } from 'react';
import '../css/Blog.css';

type ImageProps = {
  src: string;
  alt?: string;
};

type BlogPost = {
  url: string;
  image: ImageProps;
  category: string;
  readTime: string;
  title: string;
  description: string;
  avatar: ImageProps;
  fullName: string;
  date: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  button: {
    title: string;
    variant?: "secondary" | string;
  };
  blogPosts: BlogPost[];
};

export type BlogProps = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

const ITEMS_PER_PAGE = 3;

export const Blog = (props: BlogProps) => {
  const { tagline, heading, description, button, blogPosts } = {
    ...BlogDefaults,
    ...props,
  };

  const [showAll, setShowAll] = useState(false);

  const visiblePosts = blogPosts.slice(0, ITEMS_PER_PAGE);
  const hiddenPosts = blogPosts.slice(ITEMS_PER_PAGE);
  const hasMorePosts = blogPosts.length > ITEMS_PER_PAGE;

  // Calculate remaining items for centering logic (only when showing all)
  const remainingItems = showAll ? blogPosts.length % 3 : 0;

  const renderCard = (post: BlogPost, index: number, isHidden: boolean = false) => {
    const totalIndex = isHidden ? ITEMS_PER_PAGE + index : index;
    const isLastRow = showAll && totalIndex >= blogPosts.length - remainingItems;
    
    // Calculate column span for last row items
    let columnSpan = '';
    if (isLastRow && remainingItems === 1) {
      columnSpan = 'lg:col-start-2';
    } else if (isLastRow && remainingItems === 2) {
      const isFirstOfTwo = totalIndex === blogPosts.length - 2;
      if (isFirstOfTwo) {
        columnSpan = 'lg:col-start-1 lg:col-end-2';
      } else {
        columnSpan = 'lg:col-start-3 lg:col-end-4';
      }
    }

    return (
      <div 
        key={totalIndex} 
        className={`${columnSpan} ${isHidden ? 'animate-slide-in' : ''}`}
        style={isHidden ? {
          animationDelay: `${index * 100}ms`,
          animationFillMode: 'both'
        } : {}}
      >
        <a href={post.url} className="mb-6 inline-block w-full max-w-full">
          <div className="w-full overflow-hidden">
            <img
              src={post.image.src}
              alt={post.image.alt}
              className="aspect-[3/2] size-full object-cover"
            />
          </div>
        </a>
        <a
          href={post.url}
          className="mb-2 mr-4 inline-block max-w-full text-sm font-semibold"
        >
          {post.category}
        </a>

        <a href={post.url} className="mb-2 block max-w-full">
          <h5 className="text-xl font-bold md:text-2xl">{post.title}</h5>
        </a>
        <p>{post.description}</p>
        <div className="mt-6 flex items-center">
          <div className="mr-4 shrink-0">
            <img
              src={post.avatar.src}
              alt={post.avatar.alt}
              className="size-12 min-h-12 min-w-12 rounded-full object-cover"
            />
          </div>
          <div>
            <h6 className="text-sm font-semibold">{post.fullName}</h6>
            <div className="flex items-center">
              <p className="text-sm">{post.date}</p>
              <span className="mx-2">•</span>
              <p className="text-sm">{post.readTime}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto w-full max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              {heading}
            </h2>
            <p className="md:text-md">{description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-12 lg:grid-cols-3">
          {/* Always visible posts */}
          {visiblePosts.map((post, index) => renderCard(post, index, false))}
          
          {/* Hidden posts with animation */}
          {showAll && hiddenPosts.map((post, index) => renderCard(post, index, true))}
        </div>

        {hasMorePosts && (
          <div className="flex items-center justify-center">
            <button 
              className={`default-blog-btn mt-10 md:mt-14 lg:mt-16 ${button.variant === "secondary" ? "default-blog-btn-secondary" : ""}`}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show less" : button.title}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export const BlogDefaults: Props = {
  tagline: "Blog",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  button: { title: "View all", variant: "secondary" },
  blogPosts: [
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 1",
      },
      category: "Category",
      title: "Blog title heading will go here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder avatar 3",
      },
      fullName: "Full name",
      date: "11 Jan 2022",
      readTime: "5 min read",
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 2",
      },
      category: "Category",
      title: "Blog title heading will go here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder avatar 3",
      },
      fullName: "Full name",
      date: "11 Jan 2022",
      readTime: "5 min read",
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 2",
      },
      category: "Category",
      title: "Blog title heading will go here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder avatar 3",
      },
      fullName: "Full name",
      date: "11 Jan 2022",
      readTime: "5 min read",
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 3",
      },
      category: "Category",
      title: "Blog title heading will go here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder avatar 3",
      },
      fullName: "Full name",
      date: "11 Jan 2022",
      readTime: "5 min read",
    },
  ],
};

export default Blog;
