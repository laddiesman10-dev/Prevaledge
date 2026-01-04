import { useState, useEffect, useCallback } from 'react';

// T is the full item type with an id/slug (e.g., BlogPost)
// U is the "new" item type without an id (e.g., NewBlogPost)
export function useCrudManager<T extends { id?: string; slug?: string }, U>(
  addFn: (item: U) => Promise<void>,
  updateFn: (id: string, item: U) => Promise<void>,
  deleteFn: (id: string) => Promise<void>
) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleCreateNew = useCallback(() => {
    setEditingItem(null);
    setIsFormVisible(true);
  }, []);

  const handleEdit = useCallback((item: T) => {
    setEditingItem(item);
    setIsFormVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsFormVisible(false);
    setEditingItem(null);
  }, []);

  const handleDelete = useCallback(async (item: T, itemName: string) => {
    const id = item.id || item.slug;
    if (!id) {
        setFeedback({ type: 'error', message: `Cannot delete ${itemName}, missing identifier.` });
        return;
    }
    if (window.confirm(`Are you sure you want to delete this ${itemName}? This action cannot be undone.`)) {
      setIsLoading(true);
      setFeedback(null);
      try {
        await deleteFn(id);
        setFeedback({ type: 'success', message: `${itemName.charAt(0).toUpperCase() + itemName.slice(1)} deleted successfully!` });
      } catch (e) {
        setFeedback({ type: 'error', message: `Failed to delete ${itemName}. Please try again.` });
      } finally {
        setIsLoading(false);
      }
    }
  }, [deleteFn]);

  const handleSave = useCallback(async (itemData: U, originalItem: T | null, itemName: string) => {
    setIsLoading(true);
    setFeedback(null);
    const id = originalItem?.id || originalItem?.slug;

    try {
      if (id) {
        await updateFn(id, itemData);
        setFeedback({ type: 'success', message: `${itemName.charAt(0).toUpperCase() + itemName.slice(1)} updated successfully!` });
      } else {
        await addFn(itemData);
        setFeedback({ type: 'success', message: `${itemName.charAt(0).toUpperCase() + itemName.slice(1)} created successfully!` });
      }
      handleCancel();
    } catch (e) {
      setFeedback({ type: 'error', message: `Failed to save ${itemName}. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  }, [addFn, updateFn, handleCancel]);

  return {
    isFormVisible,
    editingItem,
    isLoading,
    feedback,
    handleCreateNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel,
  };
}