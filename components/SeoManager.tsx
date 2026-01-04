import React, { useContext, useEffect } from 'react';
import { JobOpening, RouterContext, SITE_URL } from '../types';
import { SiteDataContext } from '../data/siteDataContext';
import { aiTools, initialFaqData } from '../data/siteData';
import { calculateWordCount, stripMarkdown } from '../utils/formatContent';

const SeoManager: React.FC = () => {
  const { route } = useContext(RouterContext);
  const { projects, blogPosts, jobOpenings } = useContext(SiteDataContext);
  const siteUrl = SITE_URL; 

  useEffect(() => {
    let title = "Prevaledge: Digital Marketing Agency for SEO, AI & Web Dev";
    let description = "Prevaledge is a results-driven digital marketing agency specializing in SEO, AI & Automation, Website Development, and Performance Marketing.";
    let canonicalUrl = siteUrl + (route === '/site' || route === '/' ? '' : route);
    let imageUrl = `${siteUrl}/social-share-image.jpg`; // A default share image
    let schema: object | null = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Prevaledge",
      "url": siteUrl,
      "logo": `${siteUrl}/favicon.svg`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "C 1 To 26 Vardhman Grandeur, Andheri West",
        "addressLocality": "Mumbai",
        "postalCode": "400058",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9455573671",
        "contactType": "Customer Service",
        "email": "info@prevaledge.com"
      },
      "sameAs": [
        "https://www.instagram.com/prevaledge",
        "https://twitter.com/prevaledge",
        "https://www.linkedin.com/company/prevaledge"
      ]
    };
    
    // Homepage specific schema
    if (route === '/' || route === '/site' || route.startsWith('/#')) {
        const faqSchemaPart = {
          "@type": "FAQPage",
          "mainEntity": initialFaqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        };

        schema = {
            "@context": "https://schema.org",
            "@graph": [
                (schema as object), // Include the base Organization schema
                {
                    "@type": "WebSite",
                    "url": siteUrl,
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": {
                            "@type": "EntryPoint",
                            "urlTemplate": `${siteUrl}/search?q={search_term_string}`
                        },
                        "query-input": "required name=search_term_string"
                    }
                },
                faqSchemaPart
            ]
        };
    }

    if (route.startsWith('/project/')) {
        const slug = route.split('/project/')[1];
        const project = projects.find(p => p.slug === slug);
        if (project) {
            title = `${project.title} | Prevaledge Case Study`;
            description = `Case study for ${project.title}: ${project.caseStudy.challenge.substring(0, 150)}...`;
            imageUrl = project.image;
            const fullContent = `${project.caseStudy.challenge} ${project.caseStudy.solution} ${project.caseStudy.results}`;

            schema = {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": project.title,
              "image": [project.image],
              "author": { "@type": "Organization", "name": "Prevaledge" },
              "publisher": {
                 "@type": "Organization",
                 "name": "Prevaledge",
                 "logo": { "@type": "ImageObject", "url": `${siteUrl}/favicon.svg` }
              },
              "description": description,
              "wordCount": calculateWordCount(fullContent),
              "articleBody": stripMarkdown(fullContent),
              "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
            }
        }
    } else if (route.startsWith('/blog/')) {
        const slug = route.split('/blog/')[1];
        const post = blogPosts.find(p => p.slug === slug);
        if (post) {
            title = post.metaTitle || `${post.title} | Prevaledge Blog`;
            description = post.metaDescription || post.excerpt;
            imageUrl = post.image;
            schema = {
              "@context": "https://schema.org",
              "@graph": [
                {
                    "@type": "Article",
                    "headline": post.title,
                    "image": [post.image],
                    "datePublished": new Date(post.date).toISOString(),
                    "dateModified": new Date(post.date).toISOString(), // Use publish date as modified date
                    "author": { "@type": "Person", "name": post.author },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Prevaledge",
                        "logo": { "@type": "ImageObject", "url": `${siteUrl}/favicon.svg` }
                    },
                    "description": description,
                    "wordCount": calculateWordCount(post.content),
                    "articleBody": stripMarkdown(post.content),
                    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Blog",
                        "item": `${siteUrl}/blog`
                    },{
                        "@type": "ListItem",
                        "position": 2,
                        "name": post.title
                    }]
                }
              ]
            }
        }
    } else if (route.startsWith('/ai-toolkit/')) {
        const toolId = route.split('/ai-toolkit/')[1];
        const tool = aiTools.find(t => t.id === toolId);
        if (tool) {
            title = `${tool.title} | Prevaledge AI Toolkit`;
            description = `${tool.description} Use our free AI-powered tool to enhance your marketing.`;
            schema = {
                "@context": "https://schema.org",
                "@type": "Service",
                "name": tool.title,
                "description": tool.description,
                "url": canonicalUrl,
                "provider": {
                    "@type": "Organization",
                    "name": "Prevaledge"
                },
                "isSimilarTo": {
                    "@type": "Service",
                    "name": "Digital Marketing Services"
                }
            }
        }
    } else if (route === '/blog') {
        title = "The Prevaledge Blog | Digital Marketing Insights";
        description = "Explore insights, strategies, and news from the forefront of digital innovation, covering SEO, AI, web development, and more.";
    } else if (route === '/ai-toolkit') {
        title = "Free AI Marketing Toolkit | Prevaledge";
        description = "Explore our suite of free, powerful AI tools designed to enhance your digital marketing strategy and accelerate your growth.";
        schema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "AI Marketing Toolkit",
            "description": description,
            "itemListElement": aiTools.map((tool, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Service",
                    "name": tool.title,
                    "description": tool.description,
                    "url": `${siteUrl}/ai-toolkit/${tool.id}`,
                    "provider": {
                        "@type": "Organization",
                        "name": "Prevaledge"
                    }
                }
            }))
        }
    } else if (route === '/careers') {
        title = "Careers at Prevaledge | Join Our Team";
        description = "Explore career opportunities at Prevaledge. We're looking for talented individuals in SEO, AI, and web development to help us build the future of digital marketing.";
        // Create JobPosting schema for each opening
        schema = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "url": canonicalUrl,
            "mainEntity": {
                "@type": "ItemList",
                "name": "Job Openings at Prevaledge",
                "itemListElement": jobOpenings.map((job, index) => {
                    const validThroughDate = new Date(job.datePosted);
                    validThroughDate.setDate(validThroughDate.getDate() + 90); // Assume valid for 90 days

                    const employmentType = job.type.toUpperCase().replace('-', '_') as 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP';

                    const jobLocation: any = {
                        "@type": "Place",
                        "address": {
                            "@type": "PostalAddress",
                            "addressCountry": "IN"
                        }
                    };

                    if (job.location !== 'Remote' && !job.location.includes('/')) {
                        jobLocation.address.addressLocality = job.location;
                    }

                    return {
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                            "@type": "JobPosting",
                            "title": job.title,
                            "description": `<p>${job.description}</p><h4>Responsibilities</h4><ul>${job.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul><h4>Qualifications</h4><ul>${job.qualifications.map(q => `<li>${q}</li>`).join('')}</ul>`,
                            "datePosted": job.datePosted,
                            "validThrough": validThroughDate.toISOString(),
                            "employmentType": employmentType,
                            "hiringOrganization": {
                                "@type": "Organization",
                                "name": "Prevaledge",
                                "sameAs": siteUrl
                            },
                            "jobLocation": jobLocation,
                            ...(job.location.includes('Remote') && { "jobLocationType": "TELECOMMUTE" })
                        }
                    }
                })
            }
        }
    } else if (route === '/privacy-policy') {
        title = "Privacy Policy | Prevaledge";
        description = "Read the privacy policy for Prevaledge, outlining how we collect, use, and protect your data.";
    } else if (route === '/terms-and-conditions') {
        title = "Terms & Conditions | Prevaledge";
        description = "Read the terms and conditions for using the Prevaledge website and services.";
    }

    // Update document head
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
    
    // Update Open Graph tags
    document.querySelector('meta[property="og:site_name"]')?.setAttribute('content', 'Prevaledge');
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', imageUrl);
    
    // Update Twitter Card tags
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', imageUrl);

    // Update or create JSON-LD script tag
    let scriptTag: HTMLScriptElement | null = document.getElementById('json-ld-schema') as HTMLScriptElement | null;
    if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'json-ld-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
    }
    scriptTag.innerHTML = schema ? JSON.stringify(schema) : '';

    // Update hreflang tags for internationalization foundation
    const existingHreflang = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingHreflang.forEach(link => link.remove());

    const hreflangEn = document.createElement('link');
    hreflangEn.rel = 'alternate';
    hreflangEn.hreflang = 'en';
    hreflangEn.href = canonicalUrl;
    document.head.appendChild(hreflangEn);

    const hreflangXDefault = document.createElement('link');
    hreflangXDefault.rel = 'alternate';
    hreflangXDefault.hreflang = 'x-default';
    hreflangXDefault.href = canonicalUrl;
    document.head.appendChild(hreflangXDefault);

  }, [route, projects, blogPosts, jobOpenings]);

  return null; // This component doesn't render anything to the DOM
};

export default SeoManager;