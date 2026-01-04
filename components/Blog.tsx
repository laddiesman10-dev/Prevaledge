import React, { useContext } from 'react';
import AnimateOnScroll from './ui/AnimateOnScroll';
import { SiteDataContext } from '../data/siteDataContext';
import Button from './ui/Button';
import FileTextIcon from './icons/FileTextIcon';

const BlogSection: React.FC = () => {
  const { blogPosts } = useContext(SiteDataContext);

  if (!blogPosts || blogPosts.length === 0) {
    return (
      <section id="blog" className="py-20" aria-labelledby="blog-heading">
        <p className="text-center text-slate-400">No blog posts available at the moment.</p>
      </section>
    );
  }
  
  // Limiting to 6 posts for a clean grid on the homepage
  const displayedPosts = blogPosts.slice(0, 6);

  return (
    <section id="blog" className="py-20" aria-labelledby="blog-heading">
      <AnimateOnScroll>
        <div className="text-center">
          <h2 id="blog-heading" className="text-4xl font-bold mb-4">
            From the <span className="text-blue-400">Prevaledge Blog</span>
          </h2>
          <p className="max-w-3xl mx-auto text-slate-400 mb-12">
            Insights, strategies, and news from the forefront of digital innovation.
          </p>
        </div>
      </AnimateOnScroll>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedPosts.map((post, index) => (
           <AnimateOnScroll key={post.slug} delay={index * 100}>
            <Button 
              href={`/blog/${post.slug}`}
              variant="link"
              className="text-left p-0 w-full h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 group"
              aria-label={`Read blog post: ${post.title}`}
            >
              <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-800 rounded-lg overflow-hidden transition-all duration-300 group-hover:border-blue-500/50 group-hover:-translate-y-1 h-full flex flex-col">
                <div className="relative">
                  {post.image ? (
                    <img src={post.image} alt={`Hero image for blog post titled "${post.title}"`} className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity" width="1470" height="980" loading="lazy" decoding="async"/>
                  ) : (
                    <div className="w-full h-48 bg-slate-800 flex items-center justify-center">
                        <FileTextIcon className="w-16 h-16 text-slate-600" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-sm font-semibold text-purple-400 mb-2">{post.category}</p>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors flex-grow">{post.title}</h3>
                  <p className="text-slate-400 text-sm">{post.excerpt}</p>
                  <p className="text-xs text-slate-500 mt-4">By {post.author} on {post.date} &bull; {post.readTime} min read</p>
                </div>
              </div>
            </Button>
          </AnimateOnScroll>
        ))}
      </div>

      <AnimateOnScroll>
        <div className="text-center mt-16">
            <Button href="/blog" variant="secondary">
                View All Posts
            </Button>
        </div>
      </AnimateOnScroll>
    </section>
  );
};

export default BlogSection;