import request from './request';

async function getUsers(isAuth = false, token = null) {
  const users = await request(
    `
    query { 
      users { 
        id
        name
        email
      }
    }`,
    isAuth,
    token
  );
  return users.data.users;
}

async function createUser(name, email, password) {
  const mutation = `
    mutation {
      createUser(
        data: {
          name: "${name}"
          email: "${email}"
          password: "${password}"
        }
      ) {
        user{
          id
          name
          email
        }
        token
      }
    }
  `;
  const createUser = await request(mutation);
  return createUser.data.createUser;
}

async function login(email, password) {
  const mutation = `
    mutation {
      login(
        data: {
          email: "${email}"
          password: "${password}"
        }
      ) {
        user{
          id
          name
          email
        }
        token
      }
    }
  `;
  const loginResponse = await request(mutation);
  return loginResponse.data.login;
}

async function getProfile(headers) {
  const profile = await request(
    `
    query { 
      me { 
        id
        name
        email
      }
    }`,
    headers
  );
  return profile.data.me;
}

export { getUsers, createUser, login, getProfile };
