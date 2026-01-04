import React, { useContext, useState, useEffect } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import type { PricingPlan, NewPricingPlan, ServicePricing } from '../../../types';
import Button from '../../ui/Button';
import PricingPlanForm from '../PricingPlanForm';
import PlusIcon from '../../icons/PlusIcon';
import Toast from '../../ui/Toast';
import LoadingSpinner from '../../ui/LoadingSpinner';
import ManagementTable from '../ui/ManagementTable';
import EditIcon from '../../icons/EditIcon';
import { inputClass, labelClass } from '../ui/formStyles';

const PricingManagementView: React.FC = () => {
  const { servicePricingData, addPricingPlan, updatePricingPlan, deletePricingPlan, updateServiceDiscount } = useContext(SiteDataContext);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [isDiscountFormVisible, setIsDiscountFormVisible] = useState(false);
  const [editingService, setEditingService] = useState<ServicePricing | null>(null);
  const [discountData, setDiscountData] = useState({ percentage: '', endDate: '' });

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Plan CRUD handlers
  const handleCreateNewPlan = (serviceId: string) => {
    setEditingPlan(null);
    setCurrentServiceId(serviceId);
    setIsFormVisible(true);
  };

  const handleEditPlan = (plan: PricingPlan, serviceId: string) => {
    setEditingPlan(plan);
    setCurrentServiceId(serviceId);
    setIsFormVisible(true);
  };

  const handleCancelPlanForm = () => {
    setIsFormVisible(false);
    setEditingPlan(null);
    setCurrentServiceId(null);
  };

  const handleSavePlan = async (planData: NewPricingPlan) => {
    if (!currentServiceId) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      if (editingPlan) {
        await updatePricingPlan(currentServiceId, editingPlan.id, planData);
        setFeedback({ type: 'success', message: 'Plan updated successfully!' });
      } else {
        await addPricingPlan(currentServiceId, planData);
        setFeedback({ type: 'success', message: 'Plan created successfully!' });
      }
      handleCancelPlanForm();
    } catch (e) {
      setFeedback({ type: 'error', message: 'Failed to save plan. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlan = async (plan: PricingPlan, serviceId: string) => {
    if (window.confirm(`Are you sure you want to delete the "${plan.name}" plan? This action cannot be undone.`)) {
      setIsLoading(true);
      setFeedback(null);
      try {
        await deletePricingPlan(serviceId, plan.id);
        setFeedback({ type: 'success', message: 'Plan deleted successfully!' });
      } catch (e) {
        setFeedback({ type: 'error', message: 'Failed to delete plan. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Discount handlers
  const handleEditDiscount = (service: ServicePricing) => {
    setEditingService(service);
    setDiscountData({
      percentage: service.discountPercentage?.toString() || '',
      endDate: service.discountEndDate || '',
    });
    setIsDiscountFormVisible(true);
  };
  
  const handleSaveDiscount = async () => {
    if (!editingService) return;
    setIsLoading(true);
    try {
      await updateServiceDiscount(editingService.id, {
        discountPercentage: discountData.percentage ? parseFloat(discountData.percentage) : null,
        discountEndDate: discountData.endDate || null,
      });
      setFeedback({ type: 'success', message: 'Discount updated successfully!' });
    } catch (e) {
      setFeedback({ type: 'error', message: 'Failed to update discount.' });
    } finally {
      setIsLoading(false);
      handleCancelDiscount();
    }
  };

  const handleCancelDiscount = () => {
    setIsDiscountFormVisible(false);
    setEditingService(null);
  };


  const pricingPlanColumns = [
    { header: 'Plan Name', accessor: (plan: PricingPlan) => plan.name },
    { header: 'Price', accessor: (plan: PricingPlan) => `${plan.price} ${plan.priceDetail || ''}` },
    { 
      header: 'Popular', 
      accessor: (plan: PricingPlan) => plan.isPopular ? <span className="text-xs font-bold text-blue-400 bg-blue-900/50 px-2 py-1 rounded-full">Yes</span> : null 
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 relative">
      {feedback && <Toast message={feedback.message} type={feedback.type} onClose={() => setFeedback(null)} />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Manage Plans & Pricing</h1>
      </div>
      
      {isLoading && <LoadingSpinner size="md" />}

      {isFormVisible ? (
        <PricingPlanForm plan={editingPlan} onSave={handleSavePlan} onCancel={handleCancelPlanForm} />
      ) : (
        <div className="space-y-10 animate-fade-in">
          {servicePricingData.map(service => (
            <div key={service.id}>
              <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                        <service.icon className="w-6 h-6 text-blue-400" />
                        {service.serviceTitle}
                    </h2>
                    <button onClick={() => handleEditDiscount(service)} className="text-slate-400 hover:text-white transition-colors"><EditIcon className="w-4 h-4" /></button>
                    {service.discountPercentage && (
                        <span className="text-xs font-bold text-red-400 bg-red-900/50 px-2 py-1 rounded-full">
                            {service.discountPercentage}% OFF
                        </span>
                    )}
                  </div>
                  <Button onClick={() => handleCreateNewPlan(service.id)} variant="secondary">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add New Plan
                  </Button>
              </div>
              <ManagementTable<PricingPlan>
                columns={pricingPlanColumns}
                data={service.plans}
                onEdit={(plan) => handleEditPlan(plan, service.id)}
                onDelete={(plan) => handleDeletePlan(plan, service.id)}
                getItemName={(plan) => plan.name}
              />
            </div>
          ))}
        </div>
      )}

      {isDiscountFormVisible && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={handleCancelDiscount}>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-6">Edit Discount for {editingService.serviceTitle}</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleSaveDiscount(); }} className="space-y-4">
                    <div>
                        <label htmlFor="percentage" className={labelClass}>Discount Percentage (%)</label>
                        <input
                            type="number"
                            id="percentage"
                            value={discountData.percentage}
                            onChange={(e) => setDiscountData({...discountData, percentage: e.target.value})}
                            className={inputClass}
                            placeholder="e.g., 25"
                        />
                    </div>
                     <div>
                        <label htmlFor="endDate" className={labelClass}>End Date (Optional)</label>
                        <input
                            type="date"
                            id="endDate"
                            value={discountData.endDate}
                            onChange={(e) => setDiscountData({...discountData, endDate: e.target.value})}
                            className={inputClass}
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="secondary" onClick={handleCancelDiscount}>Cancel</Button>
                        <Button type="submit">Save Discount</Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default PricingManagementView;