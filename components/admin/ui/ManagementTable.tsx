import React from 'react';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
}

interface ManagementTableProps<T extends { id?: string; slug?: string }> {
  columns: Column<T>[];
  data: T[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  getItemName: (item: T) => string;
}

const ManagementTable = <T extends { id?: string; slug?: string }>({ columns, data, onEdit, onDelete, getItemName }: ManagementTableProps<T>) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-lg overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
            <tr>
              {columns.map(col => <th key={col.header} scope="col" className="px-6 py-3">{col.header}</th>)}
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const key = item.id || item.slug;
              return (
                <tr key={key} className="border-b border-slate-800 hover:bg-slate-800/30">
                  {columns.map((col, index) => {
                     const content = col.accessor(item);
                      // Apply th scope for the first column for accessibility
                     if (index === 0) {
                         return <th key={col.header} scope="row" className={`px-6 py-4 font-medium text-white whitespace-nowrap ${col.className || ''}`}>{content}</th>;
                     }
                     return <td key={col.header} className={`px-6 py-4 ${col.className || ''}`}>{content}</td>;
                  })}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onEdit(item)} className="p-2 font-medium text-blue-400 hover:text-blue-300 rounded-md hover:bg-slate-700/50" aria-label={`Edit ${getItemName(item)}`}>
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => onDelete(item)} className="p-2 font-medium text-red-500 hover:text-red-400 rounded-md hover:bg-slate-700/50" aria-label={`Delete ${getItemName(item)}`}>
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagementTable;