import babel from '@/transform/babel';
import requestFile from '@/utils/request-file';
import { createBlobUrl } from '@/utils/blob';

export default function transformScript(url: string, rawContent?: string) {
  // script may be fetched by request
  const content = rawContent ? rawContent : requestFile(url);
  const code = babel(content, url);
  const moduleUrl = createBlobUrl(code, 'text/javascript');
  return {
    moduleUrl,
    code,
  };
}
