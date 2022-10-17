import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  Scope,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { join, relative } from 'path';
import { readdirSync } from 'fs';

@Injectable({
  scope: Scope.DEFAULT,
})
export class AppService {
  logger = new Logger(AppService.name);
  readonly servePath = join(__dirname, '../../.out');

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async listCache() {
    // Get all keys
    const keys = await this.cacheManager.store.keys();

    // Loop through keys and get data
    const allData: { [key: string]: any } = {};
    for (const key of keys) {
      allData[key] = await this.cacheManager.get(key);
    }
    return allData;
  }

  async addCacheEntry(filePath: string) {
    const serveUrl = relative(this.servePath, filePath);
    await this.cacheManager.set(serveUrl, serveUrl);
    return serveUrl;
  }

  async loadCacheFromFolder() {
    const contents = readdirSync(this.servePath);

    for (const dir of contents) {
      const img = readdirSync(join(this.servePath, dir));
      if (!img?.length) continue;
      const imgServerPath = join(this.servePath, dir, img[0]);
      await this.addCacheEntry(imgServerPath);
    }
  }
}
