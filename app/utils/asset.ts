export function asset(url: string){
  const baseUrl = import.meta.env.BASE_URL
  url = url[0] === '/' ? url.slice(1) : url;
  return `${baseUrl}${url}`
}