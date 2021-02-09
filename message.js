export const message = (data) => {
  let message = '';
  message = message + Math.round(d3.csvFormat(data).length / 1024) + 'kB\n';
  message = message + data.length + 'rows\n';
  message = message + data.columns.length + 'columns\n';
  return message;
};
