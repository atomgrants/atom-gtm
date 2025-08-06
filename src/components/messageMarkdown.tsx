import Link from 'next/link';
import React, { memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

//import { CodeBlock } from "./code-block";

const components: Partial<Components> & { card: any } = {
  //code: CodeBlock,
  pre: ({ children }) => <>{children}</>,
  ol: ({ node, children, ...props }: any) => {
    return (
      <ol
        className='my-4 ml-6 list-outside list-decimal space-y-2 text-foreground'
        {...props}
      >
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }: any) => {
    return (
      <li className='pl-1 leading-relaxed' {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul
        className='my-4 ml-0 list-outside list-disc space-y-2 text-foreground md:ml-6'
        {...props}
      >
        {children}
      </ul>
    );
  },
  strong: ({ node, children, ...props }) => {
    return (
      <span className='font-semibold text-primary' {...props}>
        {children}
      </span>
    );
  },
  p: ({ node, children, ...props }) => {
    return (
      <p className='my-3 leading-relaxed text-foreground' {...props}>
        {children}
      </p>
    );
  },
  blockquote: ({ node, children, ...props }) => {
    return (
      <blockquote
        className='my-6 border-l-4 border-muted pl-6 italic text-muted-foreground'
        {...props}
      >
        {children}
      </blockquote>
    );
  },
  a: ({ node, children, ...props }: any) => {
    return (
      <Link
        className='font-medium text-atomred hover:text-atomred/80 hover:underline dark:text-atomred dark:hover:text-atomred/80'
        target='_blank'
        rel='noreferrer'
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ node, children, ...props }) => {
    return (
      <h1
        className='my-6 scroll-m-20 text-3xl font-bold tracking-tight text-primary'
        {...props}
      >
        {children}
      </h1>
    );
  },
  h2: ({ node, children, ...props }) => {
    return (
      <h2
        className='my-4 scroll-m-20 text-xl font-semibold tracking-tight text-primary'
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ node, children, ...props }) => {
    return (
      <h3
        className='my-4 scroll-m-20 text-lg font-semibold tracking-tight text-primary'
        {...props}
      >
        {children}
      </h3>
    );
  },
  h4: ({ node, children, ...props }) => {
    return (
      <h4
        className='my-4 scroll-m-20 text-base font-semibold tracking-tight text-primary'
        {...props}
      >
        {children}
      </h4>
    );
  },
  h5: ({ node, children, ...props }) => {
    return (
      <h5
        className='my-4 scroll-m-20 text-sm font-semibold tracking-tight text-primary'
        {...props}
      >
        {children}
      </h5>
    );
  },
  h6: ({ node, children, ...props }) => {
    return (
      <h6
        className='my-4 scroll-m-20 text-sm font-semibold tracking-tight text-primary'
        {...props}
      >
        {children}
      </h6>
    );
  },
  hr: ({ ...props }) => {
    return <hr className='border-px my-4' {...props} />;
  },
  table: ({ children, ...props }) => {
    return (
      <div className='w-full overflow-y-auto rounded-md border'>
        <table className='my-0 w-full' {...props}>
          {children}
        </table>
      </div>
    );
  },
  thead: ({ children, ...props }) => {
    return (
      <thead className='border-b bg-muted/50' {...props}>
        {children}
      </thead>
    );
  },
  tbody: ({ children, ...props }) => {
    return (
      <tbody className='divide-y' {...props}>
        {children}
      </tbody>
    );
  },
  tr: ({ children, ...props }) => {
    return (
      <tr className='divide-x' {...props}>
        {children}
      </tr>
    );
  },
  th: ({ children, ...props }) => {
    return (
      <th className='px-4 py-3 text-left font-medium' {...props}>
        {children}
      </th>
    );
  },
  td: ({ children, ...props }: any) => {
    // Convert <br> tags to line breaks to ensure they render properly
    const processedChildren = React.Children.map(children, (child) => {
      if (typeof child === 'string') {
        return child.replace(/<br>/g, '\n');
      }
      return child;
    });

    return (
      <td
        className='whitespace-pre-line border px-4 py-2 align-middle'
        {...props}
      >
        {processedChildren}
      </td>
    );
  },
  card: ({ children, ...props }: any) => (
    <div
      className='rounded-xl border bg-white px-4 py-2 shadow dark:bg-zinc-800'
      {...props}
    >
      {children}
    </div>
  ),
  div: ({ node, children, ...props }: any) => {
    if (props['data-label']) {
      // children is an array of strings or nodes; join if needed
      const markdownContent = React.Children.toArray(children)
        .map((child) => (typeof child === 'string' ? child : ''))
        .join('');

      // Function to check if a string contains a date and if it's in the past
      const processDateContent = (content: string) => {
        // Match Month DD, YYYY format (e.g., "March 15, 2025")
        const dateRegex =
          /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/g;
        return content.replace(dateRegex, (match) => {
          const date = new Date(match);
          const isPast = date < new Date();
          return `<span class="${
            isPast ? 'text-atomred font-medium' : ''
          }">${match}</span>`;
        });
      };

      const processedContent = processDateContent(markdownContent);

      return (
        <p className='my-2 leading-relaxed text-foreground'>
          <span className='whitespace-nowrap text-sm font-semibold'>
            {props['data-label']}
          </span>
          {'  '}
          {/* Render markdown inline */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              ...components,
              p: ({ children }) => <span>{children}</span>, // force paragraphs to be inline
            }}
          >
            {processedContent}
          </ReactMarkdown>
        </p>
      );
    }
    // fallback to default
    return <div {...props}>{children}</div>;
  },
};

const remarkPlugins = [remarkGfm, remarkBreaks];

type MessageMarkdownProps = {
  children: string;
};

const NonMemoizedMarkdown = ({ children }: MessageMarkdownProps) => {
  return (
    <div className='prose prose-zinc max-w-none text-sm dark:prose-invert'>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

export const MessageMarkdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
