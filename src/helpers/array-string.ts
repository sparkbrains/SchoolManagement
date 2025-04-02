export function arrayString(valu: any): any {
  const a = typeof valu;
  if (a === 'object' && valu !== null) {
    const error: {[key: string]: any} = {};
    for (const [key, value] of Object.entries(valu)) {
      if (key !== 'status') {
        if (key === 'detail' || key === 'message' || key === 'error') {
          error['message'] = value;
          return error;
        } else if (key !== 'message') {
          if (Array.isArray(value)) {
            error[key] = value[0];
          } else {
            error[key] = 'Invalid value type';
          }
        } else {
          error['message'] = Array.isArray(value)
            ? value[0]
            : value || 'Something went wrong';
        }
      }
    }
    return error;
  } else {
    return valu;
  }
}

export function objectToQueryString(obj: {[key: string]: any}): string {
  const queryString = Object.keys(obj)
    .filter(
      key => obj[key] !== null && obj[key] !== undefined && obj[key] !== '',
    )
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    .join('&');

  return queryString ? '?' + queryString : '';
}
