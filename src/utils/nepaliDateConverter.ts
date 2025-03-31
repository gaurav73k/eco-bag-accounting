/**
 * Utility for converting between Gregorian and Nepali Bikram Sambat dates
 * 
 * This is a placeholder implementation that should be replaced with a proper
 * Nepali date conversion library when integrating with Supabase backend
 */

// Placeholder function to convert from Gregorian to BS date
export const toNepaliBS = (date: Date): string => {
  // This is just a placeholder - replace with actual conversion logic using a proper library
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} BS`;
};

// Placeholder function to convert from BS to Gregorian date
export const fromNepaliBS = (bsDate: string): Date => {
  // This is just a placeholder - replace with actual conversion logic using a proper library
  return new Date();
};

// Fiscal year calculation in Nepal typically starts from Shrawan (mid-July)
export const getCurrentFiscalYear = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based (0 = January, 6 = July)
  
  // If current month is July or later, fiscal year is current year/next year
  // Otherwise, it's previous year/current year
  if (month >= 6) {
    return `${year}/${year + 1}`;
  } else {
    return `${year - 1}/${year}`;
  }
};

// Get fiscal years for dropdown selections
export const getFiscalYearOptions = (count: number = 5): { label: string; value: string }[] => {
  const currentYear = new Date().getFullYear();
  const options = [];
  
  for (let i = 0; i < count; i++) {
    const year = currentYear - i;
    options.push({
      label: `${year}/${year + 1}`,
      value: `${year}/${year + 1}`
    });
  }
  
  return options;
};
