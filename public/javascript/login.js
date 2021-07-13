async function loginFormHandler(event) {
    event.preventDefault();

    const email = document.querySelector('#emailLogin').value.trim();
    const password = document.querySelector('#passwordLogin').value.trim();

    if (email && password) {
      const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert(response.statusText);
      }}}

  async function signupFormHandler(event) {
    event.preventDefault();

    const username = document.querySelector('#usernameSignup').value.trim();
    const email = document.querySelector('#emailSignup').value.trim();
    const password = document.querySelector('#passwordSignup').value.trim();

    if (username && email && password) {
      const response = await fetch('/api/users', {
        method: 'post',
        body: JSON.stringify({
          username,
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert(response.statusText);
      }}}

  document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
  document.querySelector('.login-form').addEventListener('submit', loginFormHandler);