import request from './request';

async function getUsers() {
  const users = await request('{ users { id name email } }');
  return users;
}

export { getUsers };
