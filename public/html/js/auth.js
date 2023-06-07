
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
        } else {
          // Handle error cases
          console.error('Request failed with status:', xhr.status);
        }
      }
    };
  
    xhr.send();
  }




  async function fetchUsername() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = 'http://127.0.0.1:3000/profile';
  
      xhr.open('POST', url, true);
      xhr.withCredentials = true; // Enable cookie handling
  
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // Request completed successfully
            const username = xhr.responseText;
            resolve(username);
          } else {
            // Handle error cases
            reject(new Error(`Request failed with status: ${xhr.status}`));
          }
        }
      };
  
      xhr.send();
    });
  }