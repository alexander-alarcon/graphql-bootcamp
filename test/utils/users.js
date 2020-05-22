import request from './request';

async function getUsers() {
  const users = await request(`
    query { 
      users { 
        id
        name
        email
      }
    }`);
  return users;
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
  return createUser;
}

export { getUsers, createUser };
