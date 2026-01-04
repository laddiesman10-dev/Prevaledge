import React, { useContext, useState } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import type { Client, NewClient } from '../../../types';
import ClientForm from '../ClientForm';
import { useCrudManager } from '../../../hooks/useCrudManager';
import CrudView from '../ui/CrudView';
import CopyIcon from '../../icons/CopyIcon';
import CheckIcon from '../../icons/CheckIcon';

const ClientManagementView: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient } = useContext(SiteDataContext);
  const [copiedClientId, setCopiedClientId] = useState<string | null>(null);

  const crudHooks = useCrudManager<Client, NewClient>(addClient, updateClient, deleteClient);

  const handleCopyLink = (clientId: string) => {
    const url = `${window.location.origin}/portal/${clientId}`;
    navigator.clipboard.writeText(url);
    setCopiedClientId(clientId);
    setTimeout(() => setCopiedClientId(null), 2000);
  };

  const columns = [
    { header: 'Name', accessor: (client: Client) => client.name },
    { header: 'Company', accessor: (client: Client) => client.company },
    { header: 'Email', accessor: (client: Client) => client.email },
    { 
      header: 'Portal Link', 
      accessor: (client: Client) => (
        <button 
            onClick={() => handleCopyLink(client.id)}
            className="flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-900/50 hover:bg-blue-900/80 px-2 py-1 rounded-full transition-colors"
        >
          {copiedClientId === client.id ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
          {copiedClientId === client.id ? 'Copied!' : 'Copy Link'}
        </button>
      )
    },
  ];

  return (
     <CrudView<Client, NewClient>
      title="Manage Clients"
      itemName="client"
      data={clients}
      columns={columns}
      crudHooks={crudHooks}
      FormComponent={ClientForm}
      formItemPropName="client"
      itemTitleAccessor={(item) => item.name}
    />
  );
};

export default ClientManagementView;