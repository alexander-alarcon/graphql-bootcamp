import { join } from 'path';

import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

const typesArray = fileLoader(join(__dirname, './'));

const typesMerged = mergeTypes(typesArray);

export default typesMerged;
