import React from 'react';

interface ErrorProps {
  message: string;
}

const Error: React.FC<ErrorProps> = ({ message }) => {
  return <div className="text-sm text-red-400">{message}</div>;
};

export default Error;
