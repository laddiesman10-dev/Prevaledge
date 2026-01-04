// This file centralizes the CSS styles for prose content to avoid duplication.
export const proseStyles = `
.prose-custom {
    color: #cbd5e1; /* slate-300 */
}
.prose-custom a {
    color: #60a5fa; /* blue-400 */
    text-decoration: none;
    transition: color 0.2s;
}
.prose-custom a:hover {
    color: #93c5fd; /* blue-300 */
}
.prose-custom h1, .prose-custom h2, .prose-custom h3 {
    color: #f8fafc; /* slate-50 */
}
.prose-custom strong {
    color: #f1f5f9; /* slate-100 */
}
.prose-custom ul > li::marker {
    color: #60a5fa; /* blue-400 */
}
`;
