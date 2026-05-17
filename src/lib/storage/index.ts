import * as local from './local-storage';
import * as cloud from './cloud-storage';

export const storage = process.env.STORAGE === 'cloud' ? cloud : local;
