
function login(username, password) {
  const xhr = new XMLHttpRequest();
  const url = 'http://localhost:3000/login';
  const params = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

  xhr.open('POST', url, true);
  xhr.withCredentials = true; // Enable cookie handling

  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // Request completed successfully
        console.log(xhr.responseText);
        window.location.href="/";
      } else {
        // Handle error cases
        console.error('Request failed with status:', xhr.status);
      }
    }
  };

  xhr.send(params);
}

function logout() {
  const xhr = new XMLHttpRequest();
  const url = 'http://localhost:3000/logout';

  xhr.open('POST', url, true);
  xhr.withCredentials = true; // Enable cookie handling

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // Request completed successfully
        console.log('Logout successful');
        window.location.href="/";
      } else {
        // Handle error cases
        console.error('Request failed with status:', xhr.status);
      }
    }
  };

  xhr.send();

  
}




function fetchUsername() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = 'http://localhost:3000/profile';

    xhr.open('POST', url, true);
    xhr.withCredentials = true; // Enable cookie handling

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // Request completed successfully
          resolve(xhr.responseText);
        } else {
          // Handle error cases
          reject('Request failed with status: ' + xhr.status);
        }
      }
    };

    xhr.send();
  });
}