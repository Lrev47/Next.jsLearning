'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

export function Markdown({ children, className, ...props }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={cn('animate-pulse bg-gray-100 dark:bg-gray-800 h-96 rounded-md', className)} />;
  }

  return (
    <ReactMarkdown
      className={cn('prose dark:prose-invert max-w-none', className)}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        a: ({ node, ...props }) => (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto">
            <table className="border-collapse border border-gray-300 dark:border-gray-700" {...props} />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2" {...props} />
        ),
      }}
      {...props}
    >
      {children}
    </ReactMarkdown>
  );
} 