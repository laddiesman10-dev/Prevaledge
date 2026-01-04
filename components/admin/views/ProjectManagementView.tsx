import React, { useContext } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import type { Project, NewProject } from '../../../types';
import ProjectForm from '../ProjectForm';
import { useCrudManager } from '../../../hooks/useCrudManager';
import CrudView from '../ui/CrudView';

const ProjectManagementView: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useContext(SiteDataContext);
  
  const crudHooks = useCrudManager<Project, NewProject>(addProject, updateProject, deleteProject);

  const columns = [
    { header: 'Title', accessor: (project: Project) => project.title },
    { header: 'Category', accessor: (project: Project) => project.category },
  ];

  return (
    <CrudView<Project, NewProject>
      title="Manage Projects"
      itemName="project"
      data={projects}
      columns={columns}
      crudHooks={crudHooks}
      FormComponent={ProjectForm}
      formItemPropName="project"
      itemTitleAccessor={(item) => item.title}
    />
  );
};

export default ProjectManagementView;
