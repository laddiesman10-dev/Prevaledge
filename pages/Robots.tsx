import React, { useEffect } from 'react';
import { SITE_URL } from '../types';

const Robots: React.FC = () => {
    const siteUrl = SITE_URL;

    const content = `User-agent: *
Disallow: /admin/
Disallow: /portal/
Disallow: /invoice/

Sitemap: ${siteUrl}/sitemap.xml
`;

    useEffect(() => {
        // This component replaces the entire document with plain text in a <pre> tag.
        // This is a workaround for serving raw text files from a React SPA, which prevents
        // crawlers from parsing the app's HTML as robots.txt directives.
        document.head.innerHTML = '';
        document.body.innerHTML = '';
        const pre = document.createElement('pre');
        pre.style.margin = '0';
        pre.style.fontFamily = 'monospace';
        pre.textContent = content;
        document.body.appendChild(pre);
    }, [content]);

    return null;
};

export default Robots;
