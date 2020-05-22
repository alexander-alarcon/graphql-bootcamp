import fetch from 'cross-fetch';

import { PORT } from './constants';

async function request(query, headers = {}) {
  const body = JSON.stringify({ query });
  const res = await fetch(`http://localhost:${PORT}/gql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body,
  });
  const data = await res.json({ Authorization: '' });
  return data;
}

export default request;
