import React from 'react';
import Button from '../../ui/Button';
import PlusIcon from '../../icons/PlusIcon';
import Toast from '../../ui/Toast';
import LoadingSpinner from '../../ui/LoadingSpinner';
import ManagementTable from './ManagementTable';
import { useCrudManager } from '../../../hooks/useCrudManager';

interface CrudViewProps<T extends { id?: string; slug?: string }, U> {
  title: string;
  itemName: string;
  data: T[];
  columns: { header: string; accessor: (item: T) => React.ReactNode; className?: string }[];
  crudHooks: ReturnType<typeof useCrudManager<T, U>>;
  FormComponent: React.FC<any>;
  formItemPropName: string;
  itemTitleAccessor: (item: T) => string;
}

const CrudView = <T extends { id?: string; slug?: string }, U>({
  title,
  itemName,
  data,
  columns,
  crudHooks,
  FormComponent,
  formItemPropName,
  itemTitleAccessor
}: CrudViewProps<T, U>) => {
  const {
    isFormVisible,
    editingItem,
    isLoading,
    feedback,
    handleCreateNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel,
  } = crudHooks;

  return (
    <div className="p-4 sm:p-6 lg:p-8 relative">
      {feedback && (
        <Toast
          message={feedback.message}
          type={feedback.type}
          onClose={() => {}} // Toast auto-hides
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {!isFormVisible && (
          <Button onClick={handleCreateNew}>
            <PlusIcon className="w-5 h-5 mr-2" />
            Create New {itemName.charAt(0).toUpperCase() + itemName.slice(1)}
          </Button>
        )}
      </div>

      <div className="relative">
        {isLoading && <LoadingSpinner size="md" className="z-20" />}
        {isFormVisible ? (
          <FormComponent
            {...{ [formItemPropName]: editingItem }}
            onSave={(formData: U, originalItem: T | null) => handleSave(formData, originalItem, itemName)}
            onCancel={handleCancel}
          />
        ) : (
          <ManagementTable<T>
            columns={columns}
            data={data}
            onEdit={handleEdit}
            onDelete={(item) => handleDelete(item, itemName)}
            getItemName={itemTitleAccessor}
          />
        )}
      </div>
    </div>
  );
};

export default CrudView;
