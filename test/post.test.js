import { getPosts, getMyPosts, updateMyPost } from './utils/posts';
import prisma from '../src/prisma';
import store from './utils/store';

describe('Post related tests', () => {
  const user = JSON.parse(store.getItem('user'));
  const post = JSON.parse(store.getItem('post'));

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

  test('Should be able to update own post', async () => {
    const newPost = await updateMyPost(
      post.post.id,
      {
        isPublished: false,
      },
      true,
      user.jwt
    );

    const exists = await prisma.exists.Post({
      id: post.post.id,
      isPublished: false,
    });

    expect(newPost.isPublished).toBe(false);
    expect(exists).toBe(true);
  });
});
