import { getPosts } from './utils/posts';

describe('Post related tests', () => {
  test('Should expose just published posts', async () => {
    const posts = await getPosts();
    expect(posts.length).toBe(1);
    expect(posts[0].isPublished).toBe(true);
    expect(posts[0].author.name).toBe('pepe');
    expect(posts[0].author.email).toBeNull();
  });
});
