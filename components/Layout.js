import Head from 'next/head';

export default function Layout({ children, title = 'H5P AI Generator' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="AI-powered H5P content generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="container py-4">
            <h1 className="text-2xl font-bold text-primary-700">H5P AI Generator</h1>
          </div>
        </header>
        <main className="flex-grow">
          <div className="container py-8">
            {children}
          </div>
        </main>
        <footer className="bg-white border-t">
          <div className="container py-4">
            <p className="text-center text-gray-500 text-sm">
              Powered by Claude AI and H5P
            </p>
          </div>
        </footer>
      </div>
    </>
  );
} 