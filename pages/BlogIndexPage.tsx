import React, { useContext, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { SiteDataContext } from '../data/siteDataContext';
import Button from '../components/ui/Button';
import AnimateOnScroll from '../components/ui/AnimateOnScroll';
import { useScrollOnRouteChange } from '../hooks/useScrollOnRouteChange';
import FileTextIcon from '../components/icons/FileTextIcon';
import { getUnsplashSrcSet } from '../utils/formatContent';
import TrustBadges from '../components/TrustBadges';
import SearchIcon from '../components/icons/SearchIcon';

const BlogIndexPage: React.FC = () => {
  useScrollOnRouteChange('/blog');
  const { blogPosts } = useContext(SiteDataContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(blogPosts.map(p => p.category)))];
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    let posts = blogPosts;

    if (activeCategory !== 'All') {
      posts = posts.filter(p => p.category === activeCategory);
    }
    
    if (searchTerm.trim() !== '') {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        posts = posts.filter(p => 
            p.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            p.excerpt.toLowerCase().includes(lowerCaseSearchTerm) ||
            p.content.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }

    return posts;
  }, [blogPosts, activeCategory, searchTerm]);

  if (!blogPosts || blogPosts.length === 0) {
    return <div>No posts found.</div>;
  }

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);
  const totalPosts = filteredPosts.length;

  const featuredPostImages = featuredPost ? getUnsplashSrcSet(featuredPost.image) : { src: '', srcSet: ''};

  return (
    <div className="bg-slate-950 text-white font-sans animate-content-fade-in">
      <ParticleBackground />
      <Header />
      
      <main id="top" className="relative z-10 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white">
              The <span className="text-blue-400">Prevaledge</span> Blog
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
              Insights, strategies, and news from the forefront of digital innovation.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto mb-8">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
              <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles by title or keyword..."
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-full px-4 py-3 pl-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
          </div>
          
          {/* Category Filters */}
           <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-blue-500
                  ${activeCategory === category 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/70'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mb-16">
            Showing {totalPosts} of {blogPosts.length} article{blogPosts.length === 1 ? '' : 's'}.
          </p>


          {/* Featured Post */}
          {filteredPosts.length > 0 ? (
            <>
              {featuredPost && (
                <AnimateOnScroll>
                  <Button 
                      href={`/blog/${featuredPost.slug}`}
                      variant="link"
                      className="text-left p-0 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 group mb-16 block"
                      aria-label={`Read featured blog post: ${featuredPost.title}`}
                  >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900/60 backdrop-blur-lg border border-slate-800 rounded-lg overflow-hidden transition-all duration-300 group-hover:border-blue-500/50">
                          {featuredPost.image ? (
                              <img 
                                src={featuredPostImages.src}
                                srcSet={featuredPostImages.srcSet}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                alt={featuredPost.title} 
                                className="w-full h-64 md:h-full object-cover group-hover:opacity-90 transition-opacity" 
                                fetchPriority="high" 
                                decoding="async"
                                width="800"
                                height="800"
                               />
                          ) : (
                              <div className="w-full h-64 md:h-full bg-slate-800 flex items-center justify-center">
                                  <FileTextIcon className="w-24 h-24 text-slate-700" />
                              </div>
                          )}
                          <div className="p-8">
                              <p className="text-sm font-semibold text-purple-400 mb-2">{featuredPost.category}</p>
                              <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">{featuredPost.title}</h2>
                              <p className="text-slate-400 mb-4">{featuredPost.excerpt}</p>
                              <p className="text-sm text-slate-500">By {featuredPost.author} on {featuredPost.date} &bull; {featuredPost.readTime} min read</p>
                          </div>
                      </div>
                  </Button>
                </AnimateOnScroll>
              )}

              {/* Other Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherPosts.map((post, index) => {
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
                              <img 
                                src={src}
                                srcSet={srcSet}
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                alt={post.title} 
                                className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity" 
                                loading="lazy" decoding="async"
                                width="600"
                                height="400"
                              />
                          ) : (
                              <div className="w-full h-48 bg-slate-800 flex items-center justify-center">
                                  <FileTextIcon className="w-16 h-16 text-slate-700" />
                              </div>
                          )}
                          <div className="p-6 flex flex-col flex-grow">
                            <p className="text-sm font-semibold text-purple-400 mb-2">{post.category}</p>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors flex-grow">{post.title}</h3>
                            <p className="text-slate-400 text-sm">{post.excerpt}</p>
                            <p className="text-xs text-slate-500 mt-4">By {post.author} on {post.date} &bull; {post.readTime} min read</p>
                          </div>
                        </div>
                      </Button>
                    </AnimateOnScroll>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400">
                <p className="text-xl font-semibold">No articles found.</p>
                <p className="mt-2">Try adjusting your search term or category filter.</p>
            </div>
          )}

        </div>
      </main>
      
      <Footer />
      <TrustBadges />
    </div>
  );
};

export default BlogIndexPage;