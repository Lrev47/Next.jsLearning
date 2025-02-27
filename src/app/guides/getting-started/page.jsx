import Code from '@/components/ui/Code';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata = {
  title: 'Getting Started with Next.js | Next.js Guide',
  description: 'Learn how to set up and start a new Next.js project from scratch with our comprehensive guide.',
};

export default function GettingStartedPage() {
  const installCode = `# Create a new Next.js project with create-next-app
npx create-next-app@latest my-nextjs-app
# Or with Yarn
yarn create next-app my-nextjs-app
# Or with pnpm
pnpm create next-app my-nextjs-app`;

  const setupOptionsCode = `? What is your project named? my-nextjs-app
? Would you like to use TypeScript? No / Yes
? Would you like to use ESLint? No / Yes
? Would you like to use Tailwind CSS? No / Yes
? Would you like to use \`src/\` directory? No / Yes
? Would you like to use App Router? (recommended) No / Yes
? Would you like to customize the default import alias (@/*)? No / Yes`;

  const projectStructureCode = `my-nextjs-app/
├── node_modules/
├── public/
│   ├── favicon.ico
│   ├── next.svg
│   └── vercel.svg
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   └── ...
├── .eslintrc.json
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── README.md`;

  const startDevServerCode = `# Start the development server
npm run dev
# Or with Yarn
yarn dev
# Or with pnpm
pnpm dev`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Getting Started with Next.js
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Learn how to set up and start a new Next.js project from scratch.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Prerequisites</h2>
          <p>
            Before you begin, make sure you have the following installed on your machine:
          </p>
          <ul>
            <li>Node.js 18.17 or later</li>
            <li>macOS, Windows (including WSL), or Linux</li>
          </ul>

          <h2>Creating a New Project</h2>
          <p>
            The easiest way to get started with Next.js is to use the{' '}
            <code>create-next-app</code> CLI tool. This tool sets up everything
            automatically for you.
          </p>

          <Code code={installCode} language="bash" />

          <p>
            When you run this command, you'll be asked a few questions about your
            project setup:
          </p>

          <Code code={setupOptionsCode} language="bash" showLineNumbers={false} />
          
          <h2>Project Structure</h2>
          <p>
            After the installation is complete, you'll have a project structure that looks like this:
          </p>

          <Code code={projectStructureCode} language="bash" showLineNumbers={false} />

          <h2>Starting the Development Server</h2>
          <p>
            Now you can start the development server:
          </p>

          <Code code={startDevServerCode} language="bash" />

          <p>
            Open <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">http://localhost:3000</a> in your browser to see your new Next.js application.
          </p>

          <h2>Key Directories and Files</h2>
          <ul>
            <li><code>src/app</code>: Contains your application code using the App Router</li>
            <li><code>src/app/page.js</code>: The main page of your application, rendered at the root URL</li>
            <li><code>src/app/layout.js</code>: The root layout for your application</li>
            <li><code>public/</code>: Static assets like images, fonts, etc.</li>
            <li><code>next.config.mjs</code>: Configuration file for Next.js</li>
          </ul>

          <h2>Next Steps</h2>
          <p>
            Now that you have a running Next.js application, you can start building your project.
            Here are some guides to help you continue your journey:
          </p>

          <div className="not-prose my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/guides/routing" className="block group">
              <div className="h-full p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">File-based Routing</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Learn how Next.js handles routing with the file system.</p>
              </div>
            </Link>
            <Link href="/guides/data-fetching" className="block group">
              <div className="h-full p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">Data Fetching</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Understand the different ways to fetch data in Next.js.</p>
              </div>
            </Link>
          </div>

          <div className="mt-12 flex justify-center">
            <Button as={Link} href="/guides">
              View All Guides
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 