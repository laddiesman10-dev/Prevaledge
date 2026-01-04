import React, { useContext } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import type { Service, NewService } from '../../../types';
import ServiceForm from '../ServiceForm';
import { useCrudManager } from '../../../hooks/useCrudManager';
import CrudView from '../ui/CrudView';

const ServicesManagementView: React.FC = () => {
  const { services, addService, updateService, deleteService } = useContext(SiteDataContext);
  
  const crudHooks = useCrudManager<Service, NewService & { iconName?: string }>(addService, updateService, deleteService);

  const columns = [
    { header: 'Service Title', accessor: (service: Service) => service.title },
    { header: 'Description', accessor: (service: Service) => service.description, className: 'max-w-md truncate' },
  ];

  return (
    <CrudView<Service, NewService & { iconName?: string }>
      title="Manage Services"
      itemName="service"
      data={services}
      columns={columns}
      crudHooks={crudHooks}
      FormComponent={ServiceForm}
      formItemPropName="service"
      itemTitleAccessor={(item) => item.title}
    />
  );
};

export default ServicesManagementView;
