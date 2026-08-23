import { useCallback, useEffect, useRef, useState } from 'react';
import { askQuestion, getChatHistory } from '../services/api';

function fromHistory(item) {
  return [
    {
      id: `${item._id}-question`,
      role: 'user',
      content: item.question
    },
    {
      id: `${item._id}-answer`,
      role: 'assistant',
      content: item.answer,
      sources: item.sources || []
    }
  ];
}

export function useChat(initialQuestion = '') {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const sentInitialQuestions = useRef(new Set());

  const loadHistory = useCallback(async () => {
    try {
      const history = await getChatHistory();
      setMessages(history.flatMap(fromHistory));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const sendMessage = useCallback(async (question) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: cleanQuestion
    };

    setMessages((current) => [...current, userMessage]);
    setLoading(true);
    setError('');

    try {
      const response = await askQuestion(cleanQuestion);
      setMessages((current) => [
        ...current,
        {
          id: response.id || `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.answer,
          sources: response.sources || []
        }
      ]);
    } catch (err) {
      setError(err.message);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          content: err.message,
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (initialQuestion && !sentInitialQuestions.current.has(initialQuestion)) {
      sentInitialQuestions.current.add(initialQuestion);
      sendMessage(initialQuestion);
    }
  }, [initialQuestion, sendMessage]);

  return { messages, loading, error, sendMessage, loadHistory };
}
