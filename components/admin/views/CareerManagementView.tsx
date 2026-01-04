import React, { useContext } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import type { JobOpening, NewJobOpening } from '../../../types';
import JobOpeningForm from '../JobOpeningForm';
import { useCrudManager } from '../../../hooks/useCrudManager';
import CrudView from '../ui/CrudView';

const CareerManagementView: React.FC = () => {
  const { jobOpenings, addJobOpening, updateJobOpening, deleteJobOpening } = useContext(SiteDataContext);
  
  const crudHooks = useCrudManager<JobOpening, NewJobOpening>(addJobOpening, updateJobOpening, deleteJobOpening);

  const columns = [
    { header: 'Title', accessor: (job: JobOpening) => job.title },
    { header: 'Location', accessor: (job: JobOpening) => job.location },
    { header: 'Type', accessor: (job: JobOpening) => job.type },
  ];

  return (
    <CrudView<JobOpening, NewJobOpening>
      title="Manage Career Openings"
      itemName="job opening"
      data={jobOpenings}
      columns={columns}
      crudHooks={crudHooks}
      FormComponent={JobOpeningForm}
      formItemPropName="job"
      itemTitleAccessor={(item) => item.title}
    />
  );
};

export default CareerManagementView;