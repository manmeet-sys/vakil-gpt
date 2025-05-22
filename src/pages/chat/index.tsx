
import React from 'react';
import { Navigate } from 'react-router-dom';

// This file redirects to the main chat page to avoid duplication
const ChatPageRedirect = () => {
  return <Navigate to="/chat" replace />;
};

export default ChatPageRedirect;
