const backendIP = 'http://10.31.64.43:4001';
// const backendIP = 'https://api.henhen1227.com';

export default function sendAPICall(
  toURL,
  method,
  data,
  currentUser,
  isAuthPath = false,
) {
  return fetch(`${backendIP}${isAuthPath ? '/auth' : '/calendar'}${toURL}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${currentUser ? currentUser.token : ''}`,
    },
    body: method === 'POST' ? JSON.stringify(data) : null,
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    });
}
