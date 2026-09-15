// Simple CSV generator — no external library needed for this shape of data
export function toCSV(rows, columns) {
  const escape = (val) => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = columns.map((c) => escape(c.label)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escape(c.value(row))).join(","))
    .join("\n");

  return `${header}\n${body}`;
}
