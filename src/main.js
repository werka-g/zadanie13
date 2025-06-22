import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://edecftnrzqsnavnmsqol.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZWNmdG5yenFzbmF2bm1zcW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTgxNDksImV4cCI6MjA2NjA5NDE0OX0.T-pzRGJQBer8cqj3W58erOSVAqL0AD-rjKEA281qyQ0'); 

const articlesList = document.getElementById('articles-list');
const addBtn = document.getElementById('add-article-btn');
const logoutBtn = document.getElementById('logout-btn');
const modal = document.getElementById('modal');
const form = document.getElementById('article-form');
const modalTitle = document.getElementById('modal-title');
const cancelBtn = document.getElementById('cancel-btn');
const template = document.getElementById('article-template');

let editingId = null;

async function getUser() {
  const { data } = await supabase.auth.getSession();
  return data.session?.user;
}

async function loadArticles() {
  const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
  const user = await getUser();
  articlesList.innerHTML = '';

  data?.forEach((article) => {
    const node = template.content.cloneNode(true);
    node.querySelector('[data-title]').textContent = article.title;
    node.querySelector('[data-subtitle]').textContent = article.subtitle;
    node.querySelector('[data-content]').textContent = article.content;
    node.querySelector('[data-author]').textContent = article.author;
    node.querySelector('[data-date]').textContent = new Date(article.created_at).toLocaleString();

    if (user) {
      node.querySelector('.edit-btn').onclick = () => openModal('edit', article);
      node.querySelector('.delete-btn').onclick = () => deleteArticle(article.id);
    } else {
      node.querySelector('[data-owner-actions]').remove();
    }

    articlesList.appendChild(node);
  });
}

function openModal(mode, article = {}) {
  modal.classList.remove('hidden');
  modalTitle.textContent = mode === 'edit' ? 'Edytuj artykuł' : 'Dodaj artykuł';
  form.title.value = article.title || '';
  form.subtitle.value = article.subtitle || '';
  form.author.value = article.author || '';
  form.content.value = article.content || '';
  editingId = mode === 'edit' ? article.id : null;
}

function closeModal() {
  modal.classList.add('hidden');
  form.reset();
  editingId = null;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newArticle = {
    title: form.title.value,
    subtitle: form.subtitle.value,
    author: form.author.value,
    content: form.content.value,
    created_at: new Date().toISOString()
  };

  if (editingId) {
    await supabase.from('articles').update(newArticle).eq('id', editingId);
  } else {
    await supabase.from('articles').insert([newArticle]);
  }

  closeModal();
  loadArticles();
});

async function deleteArticle(id) {
  await supabase.from('articles').delete().eq('id', id);
  loadArticles();
}

addBtn.onclick = () => openModal('add');
cancelBtn.onclick = closeModal;

logoutBtn.onclick = async () => {
  await supabase.auth.signOut();
  window.location.href = '/login.html';
};

loadArticles();
