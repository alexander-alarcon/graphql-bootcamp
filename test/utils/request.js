import fetch from 'cross-fetch';

import { PORT } from './constants';

async function request(query, isAuth = false, token = null) {
  const body = JSON.stringify({ query });
  let headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (isAuth) {
    headers.Authorization = `${token}`;
  }
  const res = await fetch(`http://localhost:${PORT}/gql`, {
    method: 'POST',
    headers,
    body,
  });
  const data = await res.json();
  return data;
}

export default request;
