import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://edecftnrzqsnavnmsqol.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZWNmdG5yenFzbmF2bm1zcW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTgxNDksImV4cCI6MjA2NjA5NDE0OX0.T-pzRGJQBer8cqj3W58erOSVAqL0AD-rjKEA281qyQ0'); 


const form = document.getElementById('login-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert('Błąd logowania: ' + error.message);
  } else {
    window.location.href = '/index.html';
  }
});
