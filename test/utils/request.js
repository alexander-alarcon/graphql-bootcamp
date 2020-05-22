import fetch from 'cross-fetch';

async function request(query, type = 'query') {
  const PORT = process.env.PORT || 4001;
  const res = await fetch(`http://localhost:${PORT}/gql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ [type]: query }),
  });
  const data = await res.json();
  return data;
}

export default request;
