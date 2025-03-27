
/**
 * Utility functions for exporting data to various formats
 */

/**
 * Convert JSON data to CSV format
 * @param data Array of objects to convert
 * @returns CSV string
 */
export const jsonToCSV = (data: any[]): string => {
  if (!data || !data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header]?.toString() || '';
      // Escape quotes and wrap with quotes if the value contains commas or quotes
      const escaped = value.replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

/**
 * Export data to CSV file and trigger download
 * @param data Array of objects to export
 * @param filename Filename for the downloaded file (without extension)
 */
export const exportToCSV = (data: any[], filename: string): void => {
  if (!data || !data.length) return;
  
  const csvContent = jsonToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create download link and trigger click
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate Excel-compatible date for the filename
 * @returns Formatted date string (YYYY-MM-DD)
 */
export const getFormattedDate = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};
