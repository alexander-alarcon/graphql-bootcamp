import fetch from 'cross-fetch';

async function request(query) {
  const PORT = process.env.PORT || 4001;
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
