export function createBlobUrl(code: string, type = 'text/plain') {
  const blob = new Blob([code], { type });
  return URL.createObjectURL(blob);
}

export function revokeBlobUrls(urls: string[]) {
  urls.forEach((blobUrl) => {
    URL.revokeObjectURL(blobUrl);
  });
}
