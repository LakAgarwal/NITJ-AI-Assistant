import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function unwrap(response) {
  return response.data.data;
}

function messageFrom(error) {
  return error.response?.data?.message || error.message || 'Something went wrong';
}

export async function login(email, password) {
  try {
    return unwrap(await api.post('/auth/login', { email, password }));
  } catch (error) {
    throw new Error(messageFrom(error));
  }
}

export async function register(name, email, password) {
  try {
    return unwrap(await api.post('/auth/register', { name, email, password }));
  } catch (error) {
    throw new Error(messageFrom(error));
  }
}

export async function getMe() {
  try {
    return unwrap(await api.get('/auth/me'));
  } catch (error) {
    throw new Error(messageFrom(error));
  }
}

export async function uploadDocument(formData, onUploadProgress) {
  try {
    return unwrap(await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress
    }));
  } catch (error) {
    throw new Error(messageFrom(error));
  }
}

export async function getDocuments() {
  try {
    return unwrap(await api.get('/documents'));
  } catch (error) {
    throw new Error(messageFrom(error));
  }
}

export async function deleteDocument(id) {
  try {
    return unwrap(await api.delete(`/documents/${id}`));
  } catch (error) {
    throw new Error(messageFrom(error));
  }
}

export async function askQuestion(question) {
  try {
    return unwrap(await api.post('/chat', { question }));
  } catch (error) {
    throw new Error(messageFrom(error));
  }
}

export async function getChatHistory() {
  try {
    return unwrap(await api.get('/chat/history'));
  } catch (error) {
    throw new Error(messageFrom(error));
  }
}

export async function getAnalytics() {
  try {
    return unwrap(await api.get('/analytics'));
  } catch (error) {
    throw new Error(messageFrom(error));
  }
}

export default api;
