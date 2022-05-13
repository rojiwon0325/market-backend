import { SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = 'Public';
export const Public = (isPublic = true) => SetMetadata(PUBLIC_KEY, isPublic);
