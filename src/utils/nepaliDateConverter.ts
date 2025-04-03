
/**
 * Utility for converting between Gregorian and Nepali Bikram Sambat dates
 */

// Define mapping for Nepali months
const nepaliMonthNames = [
  'Baishakh', 'Jestha', 'Asar', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

// Calendar data mapping between Gregorian and Nepali BS dates
// This is a simplified implementation - a full implementation would have
// complete mapping data for a wider range of years
const calendarData: Record<number, number[][]> = {
  // Year 2080 BS (2023/2024 AD)
  2080: [
    [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 29, 31], // Days in each month
    [14, 15, 15, 16, 17, 17, 17, 17, 17, 16, 16, 15]  // Day offsets from Gregorian
  ],
  // Year 2081 BS (2024/2025 AD)
  2081: [
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // Days in each month
    [14, 15, 15, 16, 17, 17, 17, 17, 17, 16, 16, 15]  // Day offsets from Gregorian
  ],
  // Year 2082 BS (2025/2026 AD)
  2082: [
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // Days in each month
    [14, 15, 15, 16, 17, 17, 17, 17, 17, 16, 16, 15]  // Day offsets from Gregorian
  ]
};

// Function to check if a date is within our supported range
const isDateInSupportedRange = (date: Date): boolean => {
  const year = date.getFullYear();
  return year >= 2023 && year <= 2025;
};

// Convert from Gregorian to BS date
export const toNepaliBS = (date: Date): string => {
  if (!isDateInSupportedRange(date)) {
    console.warn('Date outside supported range, approximating conversion');
  }
  
  const gregYear = date.getFullYear();
  const gregMonth = date.getMonth();
  const gregDay = date.getDate();
  
  // Better approximation for BS dates
  // For 2024, Gregorian to Nepali BS conversion is approximately:
  // Jan 2024 = Poush/Magh 2080
  // Feb 2024 = Magh/Falgun 2080
  // Mar 2024 = Falgun/Chaitra 2080
  // Apr 2024 = Chaitra 2080/Baishakh 2081
  // May 2024 = Baishakh/Jestha 2081
  // ...and so on
  
  let bsYear = gregYear + 56;  // Base approximation
  let bsMonth = gregMonth;
  let bsDay = gregDay;
  
  // Adjust for specific time periods
  if (gregMonth < 3 || (gregMonth === 3 && gregDay < 14)) {
    bsYear = 2080; // First part of 2024 is 2080 BS
    
    if (gregMonth === 0) {
      // January is mainly Poush in BS
      bsMonth = 9; // Poush is the 10th month (0-indexed: 9)
      bsDay = gregDay + 16; // Approximate offset
      if (bsDay > 30) {
        bsMonth = 10; // Magh
        bsDay = bsDay - 30;
      }
    } else if (gregMonth === 1) {
      // February is mainly Magh
      bsMonth = 10; // Magh
      bsDay = gregDay + 17; // Approximate offset
      if (bsDay > 29) {
        bsMonth = 11; // Falgun
        bsDay = bsDay - 29;
      }
    } else if (gregMonth === 2) {
      // March is mainly Falgun/Chaitra
      bsMonth = 11; // Falgun
      bsDay = gregDay + 16; // Approximate offset
      if (bsDay > 30) {
        bsMonth = 0; // Chaitra
        bsDay = bsDay - 30;
        bsYear = 2081; // Year transitions in mid-April
      }
    } else if (gregMonth === 3 && gregDay < 14) {
      // Early April is Chaitra
      bsMonth = 0; // Chaitra
      bsDay = gregDay + 17; // Approximate offset
    }
  } else {
    // From mid-April 2024 onward is 2081 BS
    bsYear = 2081;
    
    if (gregMonth === 3) {
      // Mid to Late April is Baishakh
      bsMonth = 0; // Baishakh is first month (0-indexed: 0)
      bsDay = gregDay - 13; // Approximate offset
    } else if (gregMonth === 4) {
      // May is mainly Baishakh/Jestha
      bsMonth = 0; // Baishakh
      bsDay = gregDay + 17; // Approximate offset
      if (bsDay > 31) {
        bsMonth = 1; // Jestha
        bsDay = bsDay - 31;
      }
    } else {
      // For other months, use the approximate conversion
      bsMonth = (gregMonth + 1) % 12;
      bsDay = gregDay;
    }
  }
  
  // Format as YYYY-MM-DD for consistency
  return `${bsYear}-${bsMonth + 1}-${bsDay}`;
};

// Format BS date in a readable format
export const formatNepaliBS = (bsDate: string): string => {
  const [year, month, day] = bsDate.split('-').map(Number);
  const monthName = nepaliMonthNames[month - 1] || `Month ${month}`;
  return `${day} ${monthName} ${year} BS`;
};

// Parse a BS date string to its components
export const parseBSDate = (bsDate: string): { year: number, month: number, day: number } => {
  const [year, month, day] = bsDate.split('-').map(Number);
  return { year, month, day };
};

// Convert from BS to Gregorian date
export const fromNepaliBS = (bsDate: string): Date => {
  const { year, month, day } = parseBSDate(bsDate);
  
  // Base conversion - this is a very simplified approximation
  let gregYear = year - 56;  // Approximate offset between BS and AD
  let gregMonth = month - 1;
  let gregDay = day;
  
  // For 2081 BS specifically (2024/2025 AD)
  if (year === 2081) {
    if (month === 1) { // Baishakh (April/May)
      gregMonth = 3; // April
      gregDay = day + 13; // Approximate offset
      if (gregDay > 30) {
        gregMonth = 4; // May
        gregDay = gregDay - 30;
      }
    } else if (month === 2) { // Jestha (May/June)
      gregMonth = 4; // May
      gregDay = day + 14; // Approximate offset
      if (gregDay > 31) {
        gregMonth = 5; // June
        gregDay = gregDay - 31;
      }
    }
    // Implement similar logic for other months
  }
  
  return new Date(gregYear, gregMonth, gregDay);
};

// Get current date in BS format
export const getCurrentNepaliDate = (): string => {
  return toNepaliBS(new Date());
};

// Fiscal year in Nepal typically starts from Shrawan (mid-July)
export const getCurrentFiscalYear = (): string => {
  const now = new Date();
  const bsDate = toNepaliBS(now);
  const { year, month } = parseBSDate(bsDate);
  
  // If current month is Shrawan (4) or later, fiscal year is current year/next year
  // Otherwise, it's previous year/current year
  if (month >= 4) {
    return `${year}/${year + 1}`;
  } else {
    return `${year - 1}/${year}`;
  }
};

// Get fiscal years for dropdown selections with Nepali years
export const getFiscalYearOptions = (count: number = 5): { label: string; value: string }[] => {
  const bsDate = toNepaliBS(new Date());
  const { year: currentNepaliYear } = parseBSDate(bsDate);
  const options = [];
  
  for (let i = 0; i < count; i++) {
    const year = currentNepaliYear - i;
    options.push({
      label: `${year}/${year + 1} BS`,
      value: `${year}/${year + 1}`
    });
  }
  
  return options;
};

// Validate if a string is a valid BS date
export const isValidBSDate = (dateStr: string): boolean => {
  try {
    const { year, month, day } = parseBSDate(dateStr);
    
    // Check if date components are valid numbers
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return false;
    }
    
    // Check if year is in our supported range
    if (year < 2070 || year > 2090) {
      return false;
    }
    
    // Check if month is valid
    if (month < 1 || month > 12) {
      return false;
    }
    
    // Approximation for valid days in month
    const maxDays = month === 1 ? 31 : 
                    month === 2 ? 32 :
                    month === 3 ? 31 :
                    month === 4 ? 32 :
                    month === 5 ? 31 :
                    month === 6 ? 30 :
                    month === 7 ? 30 :
                    month === 8 ? 30 :
                    month === 9 ? 29 :
                    month === 10 ? 30 :
                    month === 11 ? 29 : 31;
                    
    return day >= 1 && day <= maxDays;
  } catch (e) {
    return false;
  }
};
