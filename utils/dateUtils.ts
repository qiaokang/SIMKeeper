import { EXPIRY_DAYS, WARNING_DAYS, CRITICAL_DAYS } from '../constants';
import { ExpiryStatus } from '../types';

export const calculateDaysRemaining = (lastUsageDate: string): number => {
  const lastUsage = new Date(lastUsageDate);
  const expiryDate = new Date(lastUsage.getTime() + EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  const now = new Date();
  
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const getExpiryStatus = (daysRemaining: number): ExpiryStatus => {
  if (daysRemaining <= 0) return ExpiryStatus.EXPIRED;
  if (daysRemaining <= CRITICAL_DAYS) return ExpiryStatus.CRITICAL;
  if (daysRemaining <= WARNING_DAYS) return ExpiryStatus.WARNING;
  return ExpiryStatus.SAFE;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const getStatusColor = (status: ExpiryStatus): string => {
  switch (status) {
    case ExpiryStatus.SAFE:
      return 'bg-emerald-500 text-emerald-50';
    case ExpiryStatus.WARNING:
      return 'bg-yellow-500 text-yellow-950';
    case ExpiryStatus.CRITICAL:
      return 'bg-red-500 text-red-50';
    case ExpiryStatus.EXPIRED:
      return 'bg-gray-500 text-gray-200';
    default:
      return 'bg-slate-500';
  }
};

export const getProgressBarColor = (status: ExpiryStatus): string => {
   switch (status) {
    case ExpiryStatus.SAFE:
      return 'bg-brand-accent';
    case ExpiryStatus.WARNING:
      return 'bg-brand-warning';
    case ExpiryStatus.CRITICAL:
      return 'bg-brand-danger';
    case ExpiryStatus.EXPIRED:
      return 'bg-gray-600';
    default:
      return 'bg-brand-accent';
  }
}