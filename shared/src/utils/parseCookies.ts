export const parseCookiesToObject = (cookieString: string) => {
  const cookieObj: Record<string, string> = {};
  cookieString
    .split("; ")
    .map((e) => {
      const chunks = e.split("=");
      return [chunks.splice(0, 1)[0], chunks.join("=")];
    })
    .forEach((e) => (cookieObj[e[0]] = e[1]));
  return cookieObj;
};
