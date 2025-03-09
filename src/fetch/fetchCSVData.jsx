import Papa from "papaparse";

export const fetchCSVData = async (url) => {
  const response = await fetch(url);
  const csvText = await response.text();

  return new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => resolve(result.data),
    });
  });
};
