import {
  getPosts,
  getMyPosts,
  createPost,
  updateMyPost,
  deleteMyPost,
} from './utils/posts';
import prisma from '../src/prisma';
import store from './utils/store';

describe('Post related tests', () => {
  const user = JSON.parse(store.getItem('user'));
  const post = JSON.parse(store.getItem('post'));
  const post2 = JSON.parse(store.getItem('post2'));

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
    const updatedPost = await updateMyPost(
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

    expect(updatedPost.isPublished).toBe(false);
    expect(exists).toBe(true);
  });

  test('Should be able to create a post', async () => {
    const data = {
      title: 'Testing post creation',
      body: 'This is a test',
      isPublished: true,
    };

    const newPost = await createPost(data, true, user.jwt);
    const exists = await prisma.exists.Post({
      id: newPost.id,
    });
    expect(newPost).toHaveProperty('id');
    expect(exists).toBe(true);
  });

  test('Should be able to delete own post', async () => {
    const deletePost = await deleteMyPost(post2.post.id, true, user.jwt);
    const exists = await prisma.exists.Post({ id: post2.post.id });

    expect(exists).toBe(false);
  });
});
