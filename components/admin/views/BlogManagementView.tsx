import React, { useContext } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import type { BlogPost, NewBlogPost } from '../../../types';
import BlogForm from '../BlogForm';
import { useCrudManager } from '../../../hooks/useCrudManager';
import CrudView from '../ui/CrudView';

const BlogManagementView: React.FC = () => {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useContext(SiteDataContext);
  
  const crudHooks = useCrudManager<BlogPost, NewBlogPost>(addBlogPost, updateBlogPost, deleteBlogPost);

  const columns = [
    { header: 'Title', accessor: (post: BlogPost) => post.title },
    { header: 'Author', accessor: (post: BlogPost) => post.author },
    { header: 'Date', accessor: (post: BlogPost) => post.date },
  ];

  return (
    <CrudView<BlogPost, NewBlogPost>
      title="Manage Blog Posts"
      itemName="post"
      data={blogPosts}
      columns={columns}
      crudHooks={crudHooks}
      FormComponent={BlogForm}
      formItemPropName="post"
      itemTitleAccessor={(item) => item.title}
    />
  );
};

export default BlogManagementView;
