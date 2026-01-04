import React, { useContext } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import type { Testimonial, NewTestimonial } from '../../../types';
import TestimonialForm from '../TestimonialForm';
import { useCrudManager } from '../../../hooks/useCrudManager';
import CrudView from '../ui/CrudView';

const TestimonialManagementView: React.FC = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useContext(SiteDataContext);

  const crudHooks = useCrudManager<Testimonial, NewTestimonial>(addTestimonial, updateTestimonial, deleteTestimonial);

  const columns = [
      { header: 'Quote Excerpt', accessor: (item: Testimonial) => `"${item.quote}"`, className: 'max-w-sm truncate' },
      { header: 'Author', accessor: (item: Testimonial) => item.name },
      { header: 'Company', accessor: (item: Testimonial) => item.company },
  ];

  return (
    <CrudView<Testimonial, NewTestimonial>
      title="Manage Testimonials"
      itemName="testimonial"
      data={testimonials}
      columns={columns}
      crudHooks={crudHooks}
      FormComponent={TestimonialForm}
      formItemPropName="testimonial"
      itemTitleAccessor={(item) => `testimonial by ${item.name}`}
    />
  );
};

export default TestimonialManagementView;
