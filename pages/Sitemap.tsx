import React, { useContext, useEffect } from 'react';
import { SiteDataContext } from '../data/siteDataContext';
import { aiTools } from '../data/siteData';
import { SITE_URL } from '../types';

const Sitemap: React.FC = () => {
    const { projects, blogPosts } = useContext(SiteDataContext);
    const siteUrl = SITE_URL;

    const today = new Date().toISOString().split('T')[0];

    const staticPages = [
        { path: '', priority: '1.0', changefreq: 'weekly' },
        { path: '/ai-toolkit', priority: '0.9', changefreq: 'monthly' },
        { path: '/blog', priority: '0.9', changefreq: 'weekly' },
        { path: '/careers', priority: '0.8', changefreq: 'monthly' },
        { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
        { path: '/terms-and-conditions', priority: '0.3', changefreq: 'yearly' },
    ];
    
    const aiToolUrls = aiTools.map(tool => ({
        path: `/ai-toolkit/${tool.id}`,
        priority: '0.7',
        changefreq: 'monthly',
    }));

    const projectUrls = projects.map(project => ({
        path: `/project/${project.slug}`,
        priority: '0.7',
        changefreq: 'monthly',
    }));
    
    const blogUrls = blogPosts.map(post => ({
        path: `/blog/${post.slug}`,
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: new Date(post.date).toISOString().split('T')[0]
    }));

    const allUrls = [...staticPages, ...aiToolUrls, ...projectUrls, ...blogUrls];

    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `
  <url>
    <loc>${siteUrl}${url.path}</loc>
    <lastmod>${url.lastmod || today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`).join('')}
</urlset>`;

    useEffect(() => {
        // This component replaces the entire document with XML content in a <pre> tag.
        // This is a workaround for serving a raw XML file from a React SPA.
        document.head.innerHTML = '';
        document.body.innerHTML = '';
        const pre = document.createElement('pre');
        pre.style.margin = '0';
        pre.style.fontFamily = 'monospace';
        pre.textContent = xmlString;
        document.body.appendChild(pre);
    }, [xmlString]);

    return null;
};

export default Sitemap;
