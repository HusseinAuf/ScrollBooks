interface Params {
  [key: string]: any;
}

export const createEncodedQueryString = (params: Params): string => {
  const urlParams = new URLSearchParams();
  for (const key in params) {
    const value = params[key];
    if (value !== undefined && value !== null && value !== "") {
      urlParams.append(key, value.toString());
    }
  }
  return urlParams.toString();
};
