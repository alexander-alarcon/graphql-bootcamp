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

async function createPost(data, isAuth, token) {
  const mutation = `
    mutation {
      createPost(
        data: {
          title: "${data.title}"
          body: "${data.body}"
          isPublished: ${data.isPublished}
        }
      ) {
        id
        title
        body
        isPublished
      }
    }
  `;
  const newPost = await request(mutation, isAuth, token);
  return newPost.data.createPost;
}

async function updateMyPost(id, data, isAuth, token) {
  let payloadData = '';
  for (let [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      payloadData = `${key}: "${value}"`;
    } else {
      payloadData = `${key}: ${value}`;
    }
  }

  const updatedPost = await request(
    `
    mutation { 
      updatePost(id: "${id}", data: { ${payloadData} }) { 
        id
        title
        body
        isPublished
      }
    }`,
    isAuth,
    token
  );
  return updatedPost.data.updatePost;
}

export { getPosts, getMyPosts, createPost, updateMyPost };
