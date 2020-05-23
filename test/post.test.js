import store from './utils/store';
import { getPosts, getMyPosts } from './utils/posts';

describe('Post related tests', () => {
  const user = JSON.parse(store.getItem('user'));
  test('Should expose just published posts', async () => {
    const posts = await getPosts();
    expect(posts.length).toBe(1);
    expect(posts[0].isPublished).toBe(true);
    expect(posts[0].author.name).toBe('pepe');
    expect(posts[0].author.email).toBeNull();
  });

  test('Should show all posts from auth user', async () => {
    const posts = await getMyPosts(true, user.jwt);

    expect(posts.length).toBe(2);
    expect(posts[0].isPublished).toBe(true);
    expect(posts[1].isPublished).toBe(false);
  });
});
