import React, { useContext } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import type { SocialLink, NewSocialLink } from '../../../types';
import SocialLinkForm from '../SocialLinkForm';
import { useCrudManager } from '../../../hooks/useCrudManager';
import CrudView from '../ui/CrudView';

const SocialsManagementView: React.FC = () => {
  const { socialLinks, addSocialLink, updateSocialLink, deleteSocialLink } = useContext(SiteDataContext);
  
  const crudHooks = useCrudManager<SocialLink, NewSocialLink>(addSocialLink, updateSocialLink, deleteSocialLink);

  const columns = [
    { header: 'Platform', accessor: (link: SocialLink) => link.name },
    { header: 'URL', accessor: (link: SocialLink) => <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{link.url}</a> },
  ];

  return (
    <CrudView<SocialLink, NewSocialLink>
      title="Manage Social Links"
      itemName="social link"
      data={socialLinks}
      columns={columns}
      crudHooks={crudHooks}
      FormComponent={SocialLinkForm}
      formItemPropName="link"
      itemTitleAccessor={(item) => item.name}
    />
  );
};

export default SocialsManagementView;