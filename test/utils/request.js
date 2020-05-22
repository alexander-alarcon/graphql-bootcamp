import fetch from 'cross-fetch';

import { PORT } from './constants';

async function request(query) {
  const body = JSON.stringify({ query });
  const res = await fetch(`http://localhost:${PORT}/gql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  const data = await res.json();
  return data;
}

export default request;
