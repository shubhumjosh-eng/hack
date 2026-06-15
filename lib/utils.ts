import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number, decimals = 1): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(decimals)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(decimals)}K`;
  }
  return value.toFixed(decimals);
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)}t`;
  }
  return `${kg.toFixed(1)}kg`;
}

export function formatCo2(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)}t CO₂`;
  }
  return `${kg.toFixed(0)}kg CO₂`;
}

export function generateId(): string {
  return `eco-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical':
      return 'text-red-500 bg-red-50 border-red-200';
    case 'high':
      return 'text-orange-500 bg-orange-50 border-orange-200';
    case 'medium':
      return 'text-yellow-500 bg-yellow-50 border-yellow-200';
    case 'low':
      return 'text-green-500 bg-green-50 border-green-200';
    default:
      return 'text-gray-500 bg-gray-50 border-gray-200';
  }
}

export function getEffortBadge(effort: string): { label: string; color: string } {
  switch (effort) {
    case 'quick':
      return { label: 'Quick Win', color: 'bg-green-100 text-green-700 border-green-300' };
    case 'moderate':
      return { label: 'Moderate Effort', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
    case 'significant':
      return { label: 'Strategic', color: 'bg-blue-100 text-blue-700 border-blue-300' };
    default:
      return { label: 'Unknown', color: 'bg-gray-100 text-gray-700 border-gray-300' };
  }
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    waste: 'Food Waste',
    emission: 'Carbon Emissions',
    water: 'Water Usage',
    energy: 'Energy Consumption',
    biodiversity: 'Biodiversity Impact',
  };
  return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    waste: 'trash-2',
    emission: 'cloud',
    water: 'droplets',
    energy: 'zap',
    biodiversity: 'leaf',
  };
  return icons[category] || 'help-circle';
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.85) return 'text-green-500';
  if (confidence >= 0.6) return 'text-yellow-500';
  return 'text-red-500';
}
