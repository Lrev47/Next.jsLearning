'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import Code from '../ui/Code';
import { motion } from 'framer-motion';

export default function Features() {
  const [activeTab, setActiveTab] = useState('routing');

  const features = [
    {
      id: 'routing',
      title: 'File-based Routing',
      description: 'Create routes with file system. No configuration needed.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
        </svg>
      ),
      code: `// app/blog/[slug]/page.js
export default function BlogPost({ params }) {
  return <div>Post: {params.slug}</div>
}

// URL: /blog/hello-world
// Output: Post: hello-world`,
    },
    {
      id: 'components',
      title: 'Server & Client Components',
      description: 'Choose where each component should render for best performance.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      ),
      code: `// By default, components are Server Components
export default function ServerComponent() {
  return <h1>Hello from the server!</h1>
}

// To create a Client Component, add 'use client'
'use client'

import { useState } from 'react'

export default function ClientComponent() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}`,
    },
    {
      id: 'data',
      title: 'Data Fetching',
      description: 'Fetch data directly in components with async/await.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m-6 3.75l3 3m0 0l3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
        </svg>
      ),
      code: `// app/users/page.js
async function getUsers() {
  const res = await fetch('https://api.example.com/users')
  return res.json()
}

export default async function UsersPage() {
  const users = await getUsers()
  
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}`,
    },
    {
      id: 'styling',
      title: 'Multiple Styling Options',
      description: 'Use CSS Modules, Tailwind CSS, or any styling approach you prefer.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      ),
      code: `// Using Tailwind CSS
export default function Card() {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white 
    rounded-xl shadow-md flex items-center space-x-4">
      <div>
        <div className="text-xl font-medium text-black">
          ChitChat
        </div>
        <p className="text-gray-500">
          You have a new message!
        </p>
      </div>
    </div>
  )
}

// Using CSS Modules
// Card.module.css
// .card { ... }

// Card.js
import styles from './Card.module.css'

export default function Card() {
  return <div className={styles.card}>...</div>
}`,
    },
  ];

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Powerful Features for Modern Web Development
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Next.js provides essential features for building production-ready React applications with minimal setup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveTab(feature.id)}
              className={`flex items-center p-4 rounded-lg transition-colors ${
                activeTab === feature.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600 dark:border-primary-400'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`mr-4 ${activeTab === feature.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {feature.icon}
              </div>
              <div className="text-left">
                <h3 className={`font-medium ${activeTab === feature.id ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'}`}>
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {feature.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        >
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              {features.find(f => f.id === activeTab)?.icon}
              <span className="ml-2">{features.find(f => f.id === activeTab)?.title}</span>
            </h3>
          </div>
          <div className="p-6">
            <Code 
              code={features.find(f => f.id === activeTab)?.code || ''} 
              language="javascript"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
} 