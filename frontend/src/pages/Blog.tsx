import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "../css/Blog.css";

type ImageProps = {
  src: string;
  alt?: string;
};

type BlogPost = {
  id: number;
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

export type BlogProps = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

const ITEMS_PER_PAGE = 3;

export const Blog = (props: BlogProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Modal state for blog post popup
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open blog post in modal
  const openBlogModal = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // UZIMAMO BLOGOVE SA BACKENDA
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts"); // ako backend radi na drugom prefixu, ovdje promijeni
        if (!res.ok) {
          console.error("Failed to fetch posts:", res.status);
          setLoading(false);
          return;
        }

        const data = await res.json();

        const mapped: BlogPost[] = data.map((post: any) => ({
          id: post.id,
          url: `/blog/${post.id}`, // ili kako god ćete raditi detaljni prikaz
          image: {
            src:
              post.image_url ||
              "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
            alt: post.title,
          },
          category: post.category,
          readTime: post.read_time || "5 min read",
          title: post.title,
          description: post.short_desc,
          avatar: {
            src:
              post.users?.profile_picture ||
              "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: post.users
              ? `${post.users.first_name} ${post.users.last_name}`
              : "Author",
          },
          fullName: post.users
            ? `${post.users.first_name} ${post.users.last_name}`
            : "Unknown author",
          date: post.created_at
            ? new Date(post.created_at).toLocaleDateString()
            : "",
        }));

        setPosts(mapped);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const [showAll, setShowAll] = useState(false);

  const blogPosts = posts;

  const visiblePosts = blogPosts.slice(0, ITEMS_PER_PAGE);
  const hiddenPosts = blogPosts.slice(ITEMS_PER_PAGE);
  const hasMorePosts = blogPosts.length > ITEMS_PER_PAGE;

  const remainingItems = showAll ? blogPosts.length % 3 : 0;

  const renderCard = (
    post: BlogPost,
    index: number,
    isHidden: boolean = false
  ) => {
    const totalIndex = isHidden ? ITEMS_PER_PAGE + index : index;
    const isLastRow =
      showAll && totalIndex >= blogPosts.length - remainingItems;

    let columnSpan = "";
    if (isLastRow && remainingItems === 1) {
      columnSpan = "lg:col-start-2";
    } else if (isLastRow && remainingItems === 2) {
      const isFirstOfTwo = totalIndex === blogPosts.length - 2;
      if (isFirstOfTwo) {
        columnSpan = "lg:col-start-1 lg:col-end-2";
      } else {
        columnSpan = "lg:col-start-3 lg:col-end-4";
      }
    }

    return (
      <div
        key={post.id}
        className={`${columnSpan} ${isHidden ? "animate-slide-in" : ""}`}
        style={
          isHidden
            ? {
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both",
              }
            : {}
        }
      >
        <div 
          onClick={() => openBlogModal(post)}
          className="mb-6 inline-block w-full max-w-full cursor-pointer"
        >
          <div className="w-full overflow-hidden">
            <img
              src={post.image.src}
              alt={post.image.alt}
              className="aspect-[3/2] size-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <button
          onClick={() => openBlogModal(post)}
          className="mb-2 mr-4 inline-block max-w-full text-sm font-semibold hover:text-[#294a70] transition-colors cursor-pointer"
        >
          {post.category}
        </button>

        <div 
          onClick={() => openBlogModal(post)}
          className="mb-2 block max-w-full cursor-pointer"
        >
          <h5 className="text-xl font-bold md:text-2xl hover:text-[#294a70] transition-colors">{post.title}</h5>
        </div>
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
    <>
      <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="mb-12 md:mb-18 lg:mb-20">
            <div className="mx-auto w-full max-w-lg text-center">
              <p className="mb-3 font-semibold md:mb-4">{t('blog.tagline')}</p>
              <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                {t('blog.heading')}
              </h2>
              <p className="md:text-md">{t('blog.description')}</p>
            </div>
          </div>

          <div className="mb-8 flex justify-end">
            <button
              onClick={() => navigate("/AddBlog")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg border-[3px] border-white"
            >
              {t('blog.addBlog')}
            </button>
          </div>

          {loading ? (
            <p className="text-center">{t('blog.loading')}</p>
          ) : blogPosts.length === 0 ? (
            <p className="text-center">{t('blog.noPosts')}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-12 lg:grid-cols-3">
                {visiblePosts.map((post, index) =>
                  renderCard(post, index, false)
                )}
                {showAll &&
                  hiddenPosts.map((post, index) => renderCard(post, index, true))}
              </div>

              {hasMorePosts && (
                <div className="flex items-center justify-center">
                  <button
                    className="default-blog-btn mt-10 md:mt-14 lg:mt-16 border-[3px] border-white default-blog-btn-secondary"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? t('blog.showLess') : t('blog.viewAll')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Blog Post Modal */}
      {isModalOpen && selectedPost && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200 overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('blog.modal.title')}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="p-6">
                  {/* Blog Image */}
                  <img
                    src={selectedPost.image.src}
                    alt={selectedPost.image.alt}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />

                  {/* Category Badge */}
                  <div className="inline-block bg-[#294a70] text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    {selectedPost.category}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {selectedPost.title}
                  </h1>

                  {/* Author Info */}
                  <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
                    <img
                      src={selectedPost.avatar.src}
                      alt={selectedPost.avatar.alt}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{selectedPost.fullName}</div>
                      <div className="text-gray-600 text-sm">
                        {selectedPost.date} • {selectedPost.readTime}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {selectedPost.description}
                    </p>
                    <p className="text-gray-500 italic">
                      {t('blog.modal.preview')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 bg-[#294a70] text-white rounded-lg hover:bg-[#1f3854] transition-colors"
                  >
                    {t('blog.modal.close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export const BlogDefaults: Props = {
  tagline: "Blog",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  button: { title: "View all", variant: "secondary" },
  blogPosts: [],
};

export default Blog;
