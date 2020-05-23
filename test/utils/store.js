import { join } from 'path';

import { createLocalStorage } from 'localstorage-ponyfill';

const localStorage = createLocalStorage({
  mode: 'node',
  storeFilePath: join(__dirname, 'store'),
});

export default localStorage;
