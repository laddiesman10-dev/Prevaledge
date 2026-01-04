
import React, { useContext, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { proseStyles } from '../styles/proseStyles';
import { SiteDataContext } from '../data/siteDataContext';
import type { BlogPost, RouterContextType } from '../types';
import { RouterContext } from '../types';
import { useScrollOnRouteChange } from '../hooks/useScrollOnRouteChange';
import { renderMarkdownContent, getUnsplashSrcSet } from '../utils/formatContent';
import TwitterIcon from '../components/icons/TwitterIcon';
import LinkedInIcon from '../components/icons/LinkedInIcon';
import FacebookIcon from '../components/icons/FacebookIcon';
import Button from './ui/Button';
import AIToolCallout from './AIToolCallout';
import AnimateOnScroll from './ui/AnimateOnScroll';
import FileTextIcon from './icons/FileTextIcon';

const RelatedPosts: React.FC<{ currentPostSlug: string; currentCategory: string }> = ({ currentPostSlug, currentCategory }) => {
  const { blogPosts } = useContext(SiteDataContext);
  
  const related = useMemo(() => {
    // 1. Filter posts in the same category, excluding the current one
    const inCategory = blogPosts.filter(
      p => p.category === currentCategory && p.slug !== currentPostSlug
    );
    
    // 2. Filter remaining posts
    const others = blogPosts.filter(
      p => p.category !== currentCategory && p.slug !== currentPostSlug
    );

    // 3. Combine and take the first 3
    return [...inCategory, ...others].slice(0, 3);

  }, [blogPosts, currentPostSlug, currentCategory]);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-12 border-t border-slate-800">
      <h3 className="text-3xl font-bold text-center text-white mb-8">You might also like</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {related.map((post, index) => {
          const { src, srcSet } = getUnsplashSrcSet(post.image);
          return (
            <AnimateOnScroll key={post.slug} delay={index * 100}>
              <Button
                href={`/blog/${post.slug}`}
                variant="link"
                className="text-left p-0 w-full h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 group"
                aria-label={`Read blog post: ${post.title}`}
              >
                <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-800 rounded-lg overflow-hidden transition-all duration-300 group-hover:border-blue-500/50 group-hover:-translate-y-1 h-full flex flex-col">
                  {post.image ? (
                      <img src={src} srcSet={srcSet} sizes="(max-width: 768px) 100vw, 33vw" alt={`Hero image for blog post titled "${post.title}"`} className="w-full h-40 object-cover" loading="lazy" decoding="async" width="400" height="225" />
                  ) : (
                      <div className="w-full h-40 bg-slate-800 flex items-center justify-center">
                          <FileTextIcon className="w-12 h-12 text-slate-700" />
                      </div>
                  )}
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="text-sm font-semibold text-purple-400 mb-2">{post.category}</p>
                    <h4 className="text-lg font-bold text-white mb-3 group-hover:text-blue-300 transition-colors flex-grow">{post.title}</h4>
                    <p className="text-xs text-slate-500 mt-auto">
                      {post.readTime} min read
                    </p>
                  </div>
                </div>
              </Button>
            </AnimateOnScroll>
          )
        })}
      </div>
    </section>
  );
};


const BlogPage: React.FC = () => {
  const { route } = useContext(RouterContext);
  const { blogPosts } = useContext(SiteDataContext);

  const slug = route.split('/blog/')[1];
  const post = blogPosts.find(p => p.slug === slug);
  
  useScrollOnRouteChange(route);

  if (!post) {
     return (
        <div className="bg-slate-950 text-white min-h-screen">
            <Header />
            <main className="pt-24 text-center">
              <h1 className="text-2xl font-bold">Post not found.</h1>
              <p className="text-slate-400 mt-4">The blog post you are looking for does not exist.</p>
              <Button href="/blog" className="mt-8">Back to Blog</Button>
            </main>
            <Footer />
        </div>
    );
  }

  // Find current post index for next/prev navigation
  const currentIndex = blogPosts.findIndex(p => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;
  
  const siteUrl = 'https://prevaledge.com';
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(post.title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };
  
  const { src, srcSet } = getUnsplashSrcSet(post.image);


  return (
    <>
      <style>{proseStyles}</style>
      <div className="bg-slate-950 text-white font-sans animate-content-fade-in">
        <ParticleBackground />
        <Header />
        
        <main id="top" className="relative z-10 pt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <article className="max-w-4xl mx-auto">
              <header className="text-center mb-12">
                <p className="text-lg font-semibold text-purple-400 mb-2">{post.category}</p>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">{post.title}</h1>
                <p className="text-slate-400 mt-4">
                  By <span className="text-slate-300">{post.author}</span> on <span className="text-slate-300">{post.date}</span> &bull; {post.readTime} min read
                </p>
              </header>
              
              {post.image ? (
                <img 
                    src={src}
                    srcSet={srcSet}
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    alt={`Hero image for blog post titled "${post.title}"`} 
                    className="w-full h-64 md:h-96 object-cover rounded-lg shadow-2xl mb-12" 
                    width="1470"
                    height="735"
                    fetchPriority="high"
                    decoding="async"
                />
              ) : (
                <div className="w-full h-64 md:h-96 bg-slate-800 rounded-lg shadow-2xl mb-12 flex items-center justify-center">
                    <FileTextIcon className="w-24 h-24 text-slate-700" />
                </div>
              )}

              <div className="prose-custom leading-relaxed">
                {renderMarkdownContent(post.content)}
              </div>
              
              <AIToolCallout category={post.category} />

              <RelatedPosts currentPostSlug={post.slug} currentCategory={post.category} />

              {/* Social Sharing Section */}
              <div className="mt-12 pt-8 border-t border-slate-800/50">
                  <h4 className="text-lg font-bold text-center text-slate-200 mb-4">Share this Article</h4>
                  <div className="flex justify-center items-center gap-8">
                      <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" className="text-slate-400 hover:text-white transition-all duration-300 transform hover:scale-110">
                          <TwitterIcon className="w-8 h-8" />
                      </a>
                      <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="text-slate-400 hover:text-white transition-all duration-300 transform hover:scale-110">
                          <LinkedInIcon className="w-8 h-8" />
                      </a>
                      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="text-slate-400 hover:text-white transition-all duration-300 transform hover:scale-110">
                          <FacebookIcon className="w-8 h-8" />
                      </a>
                  </div>
              </div>
              
              {/* Next/Prev Navigation */}
              <nav className="mt-16 flex justify-between items-center border-t border-slate-800/50 pt-8">
                <div>
                  {prevPost && (
                    <Button href={`/blog/${prevPost.slug}`} variant="secondary">
                      &larr; Previous Post
                    </Button>
                  )}
                </div>
                <div>
                  {nextPost && (
                    <Button href={`/blog/${nextPost.slug}`} variant="secondary">
                      Next Post &rarr;
                    </Button>
                  )}
                </div>
              </nav>

            </article>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default BlogPage;
