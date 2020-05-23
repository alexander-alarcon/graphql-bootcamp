import request from './request';

async function getPosts() {
  const posts = await request(`
    query { 
      posts { 
        id
        title
        isPublished
        author {
          name
          email
        }
      }
    }`);

  return posts.data.posts;
}

async function getMyPosts(isAuth, token) {
  const posts = await request(
    `
    query { 
      myPosts { 
        id
        title
        isPublished
      }
    }`,
    isAuth,
    token
  );

  return posts.data.myPosts;
}

export { getPosts, getMyPosts };
