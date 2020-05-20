import { extractFragmentReplacements } from 'prisma-binding';

import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';
import { join } from 'path';

const resolversArray = fileLoader(join(__dirname, './'));

const mergedResolvers = mergeResolvers(resolversArray);

const fragmentReplacements = extractFragmentReplacements(mergedResolvers);

export { mergedResolvers as default, fragmentReplacements };
