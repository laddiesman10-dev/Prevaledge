import React, { useContext } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import { AuthContext } from '../../../context/AuthContext';
import type { User, NewUser } from '../../../types';
import UserForm from '../TeamForm';
import { useCrudManager } from '../../../hooks/useCrudManager';
import CrudView from '../ui/CrudView';

const UserManagementView: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useContext(SiteDataContext);
  const { currentUser } = useContext(AuthContext);

  const crudHooks = useCrudManager<User, NewUser>(addUser, updateUser, deleteUser);
  
  // Enhance the FormComponent to pass the currentUser
  const FormComponentWithAuth = (props: any) => <UserForm {...props} currentUser={currentUser} />;

  const columns = [
    { header: 'Name', accessor: (user: User) => user.name },
    { header: 'Title', accessor: (user: User) => user.title },
    { header: 'Email', accessor: (user: User) => user.email },
    { header: 'Role', accessor: (user: User) => user.role },
  ];

  return (
     <CrudView<User, NewUser>
      title="Users & Permissions"
      itemName="user"
      data={users}
      columns={columns}
      crudHooks={crudHooks}
      FormComponent={FormComponentWithAuth}
      formItemPropName="user"
      itemTitleAccessor={(item) => item.name}
    />
  );
};

export default UserManagementView;