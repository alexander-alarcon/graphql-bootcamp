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

export { getPosts };
