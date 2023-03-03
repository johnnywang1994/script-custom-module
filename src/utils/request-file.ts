import { globalData } from "@/utils/constant";

export default function requestContent(url: string) {
  // console.log('reqeust', url);
  const request = new XMLHttpRequest();
  // use sync to avoid popup blocker
  request.open('GET', globalData.publicPath + url, false); // `false` makes the request synchronous
  request.send(null);
  if(request.status === 200) {
    return request.responseText;
  }
  throw new Error(request.statusText);
}
