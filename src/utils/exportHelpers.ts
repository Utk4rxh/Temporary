// src/utils/exportHelpers.ts

export const exportToCSV = (filename: string, rows: Record<string, unknown>[]) => {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            const rawVal = row[k];
            let cell = rawVal === null || rawVal === undefined ? '' : rawVal;
            cell = typeof cell === 'object' ? JSON.stringify(cell) : String(cell);
            const strCell = (cell as string).replace(/"/g, '""');
            if (strCell.search(/("|,|\n)/g) >= 0) {
              return `"${strCell}"`;
            }
            return strCell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
