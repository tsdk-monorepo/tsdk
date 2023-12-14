import Link from 'next/link';
import { Bleed } from 'nextra-theme-docs';

import ScrollAnimation from '../ScrollAnimation';
import CodeExample from './code.mdx';
import FAQ from './faq';

export default function HomePage() {
  return (
    <>
      <ScrollAnimation />
      <div className="max-w-2xl mx-auto mt-24">
        <h1 className="text-slate-900 font-extrabold text-3xl sm:text-6xl lg:text-5xl tracking-tight text-center dark:text-white leading-relaxed">
          <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-200">
            Type-safe API development and Code share tool
          </span>
        </h1>

        <h2 className="mt-4 md:mt-6 text-lg text-slate-600 text-center dark:text-slate-400">
          Easily share code between TypeScript projects, ensuring type consistency, avoiding
          potential errors, and enhancing the development experience.
        </h2>
      </div>

      <Bleed full={false}>
        <div className="flex pt-12 pb-24 justify-center bg-wave">
          <a
            href="https://github.com/tsdk-monorepo/tsdk"
            className="mr-4 bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg flex items-center justify-center sm:w-auto dark:bg-gray-800 dark:highlight-white/20 dark:hover:bg-gray-700 transition-all">
            GitHub
          </a>
          <Link
            href="/docs/intro"
            className="focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg flex items-center justify-center sm:w-auto bg-sky-600 dark:highlight-white/20 hover:bg-sky-500 transition-all">
            Documentation
          </Link>
        </div>
        <div className="bg-gradient-to-b from-slate-50 to-transparent  dark:from-gray-900">
          <div className="flex flex-col md:flex-row gap-y-12 justify-around py-12 px-0 md:px-24 lg:px-48 text-left">
            <div className="flex-1 px-8 md:pr-8 md:pl-0">
              <h3 className="text-xl font-mono font-semibold mb-2 tracking-lighter">
                🚀 First principle
              </h3>
              <div className="text-slate-600 dark:text-slate-300">
                From the essence of the re-organization of the code, no longer manually write the
                API call code as well as add types; easy to understand the concepts, and provide a
                different development experience.
              </div>
            </div>
            <div className="flex-1 px-8 md:px-4">
              <h3 className="text-xl font-mono font-semibold mb-2 tracking-lighter">
                🐱 Simple but familiar
              </h3>
              <div className="text-slate-600 dark:text-slate-300">
                If you know how to develop APIs using Express.js, then you will already know how to
                using tsdk to develop end-to-end type-safe APIs.
              </div>
            </div>
            <div className="flex-1 px-8 md:pl-8 md:pr-0">
              <h3 className="text-xl font-mono font-semibold mb-2 tracking-lighter">
                💫 Powerful and flexible
              </h3>
              <div className="text-slate-600 dark:text-slate-300">
                Depending on the core data of the API, we can: generate and export SWR or React
                Query hooks; exporting the SDK for the core business logic; API permission import;
                API auth permission detection ......
              </div>
            </div>
          </div>
        </div>

        <FAQ />

        <div className="pt-12 bg-gradient-to-b from-sky-50 to-slate-50 md:px-0  dark:from-slate-900 dark:border-none">
          <h3 className="text-slate-900 font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-center dark:text-slate-200">
            Take a Look
          </h3>
          <br />
          <CodeExample />

          <div className="flex justify-center mt-12">
            <Link
              href="/docs/quick-start"
              className="focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-sky-500 border border-slate-300 hover:bg-sky-500 hover:text-white font-semibold h-12 px-6 rounded-lg flex items-center justify-center sm:w-auto  transition-all dark:border-slate-600">
              Quick start
            </Link>
          </div>

          <div className="dark:bg-none bg-wave-3 pb-24"></div>
        </div>

        <div className="py-16 flex flex-col md:flex-row m-auto items-center justify-center bg-gradient-to-b from-sky-50 to-white dark:from-transparent dark:to-transparent dark:border-t-2 dark:border-slate-800 dark:pt-24 dark:border-dashed">
          <div className="animate--animated" data-scroll-active="animate--fadeInUp">
            <img
              src="/heart.jpeg"
              className="rounded-2xl w-64 m-auto"
              alt="Join tsdk.dev community"
            />
          </div>
          <div
            className="ml-0 mt-4 md:mt-0 md:ml-24 animate--animated"
            data-scroll-active="animate--fadeInUp">
            <div className="text-xl font-seminold text-slate-600 dark:text-slate-300 font-serif">
              Let's make it thing
            </div>
            <a
              href="https://github.com/tsdk-monorepo/tsdk/discussions"
              className="focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg flex items-center justify-center sm:w-auto bg-sky-600 dark:highlight-white/20 hover:bg-sky-500 transition-all mt-4">
              Join Discussions
            </a>
          </div>
        </div>
      </Bleed>
    </>
  );
}
