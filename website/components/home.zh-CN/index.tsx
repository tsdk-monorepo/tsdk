import Link from 'next/link';
import { Bleed } from 'nextra-theme-docs';

import ScrollAnimation from '../ScrollAnimation';
import Example from './code.mdx';
import FAQ from './faq';

export default function HomePage() {
  return (
    <>
      <ScrollAnimation />
      <div className="max-w-2xl mx-auto mt-24">
        <div className="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center dark:text-white leading-relaxed">
          <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400">
            类型安全的接口开发
            <br />
          </span>
          <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-200 dark:to-gray-400">
            与代码共享工具
          </span>
        </div>

        <div className="mt-4 md:mt-6 text-lg text-slate-600 text-center dark:text-slate-400">
          轻松地在 TypeScript 项目间共享代码
          <br />
          确保类型的一致性，减少潜在的错误和提升开发体验
        </div>
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
            📖 查看文档
          </Link>
        </div>
        <div className="bg-gradient-to-b from-slate-50 to-transparent  dark:from-gray-900">
          <div className="flex flex-col md:flex-row gap-y-12 justify-around py-12 px-0 md:px-24 lg:px-48 text-left">
            <div className="flex-1 px-8">
              <h3 className="text-xl font-mono font-semibold mb-2 tracking-lighter">🚀 第一原则</h3>
              <div className="text-slate-600 dark:text-slate-300">
                从本质出发，重新组织代码，不再手动封装接口调用代码和添加类型；通俗易懂的概念，提供不一样的开发体验。
              </div>
            </div>
            <div className="flex-1 px-8">
              <h3 className="text-xl font-mono font-semibold mb-2 tracking-lighter">
                🐱 简单且熟悉
              </h3>
              <div className="text-slate-600 dark:text-slate-300">
                如果您知道如何使用 Express 开发 API，那么您就已经会使用 tsdk 开发前后端类型安全的
                API。
              </div>
            </div>
            <div className="flex-1 px-8">
              <h3 className="text-xl font-mono font-semibold mb-2 tracking-lighter">💫 更多花样</h3>
              <div className="text-slate-600 dark:text-slate-300">
                根据接口的核心数据，我们可以玩出更多的花样：导出 SWR 或者 React Query
                钩子；导出核心业务逻辑的 SDK；接口权限导入；接口登录权限检测......
              </div>
            </div>
          </div>
        </div>

        <FAQ />

        <div className="pt-12 bg-gradient-to-b from-sky-50 to-slate-50 md:px-0  dark:from-slate-900 dark:border-none">
          <h3 className="text-slate-900 font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-center dark:text-slate-200">
            惊鸿一瞥
          </h3>
          <br />
          <Example />

          <div className="flex justify-center mt-12">
            <Link
              href="/docs/quick-start"
              className="focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-sky-500 border border-slate-300 hover:bg-sky-500 hover:text-white font-semibold h-12 px-6 rounded-lg flex items-center justify-center sm:w-auto  transition-all dark:border-slate-600">
              快速开始
            </Link>
          </div>

          <div className="dark:bg-none bg-wave-3 pb-24"></div>
        </div>

        <div className="py-16 flex flex-col md:flex-row m-auto items-center justify-center bg-gradient-to-b from-sky-50 to-white dark:from-transparent dark:to-transparent dark:border-t-2 dark:border-slate-800 dark:pt-24 dark:border-dashed">
          <div className="animate--animated" data-scroll-active="animate--fadeInUp">
            <img src="/heart.jpeg" className="rounded-2xl w-64 m-auto" />
          </div>
          <div
            className="ml-0 mt-4 md:mt-0 md:ml-24 animate--animated"
            data-scroll-active="animate--fadeInUp">
            <div className="text-xl font-seminold text-slate-600 dark:text-slate-300 font-serif">
              一起变得更强
            </div>
            <a
              href="https://github.com/tsdk-monorepo/tsdk/discussions"
              className="focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg flex items-center justify-center sm:w-auto bg-sky-600 dark:highlight-white/20 hover:bg-sky-500 transition-all mt-4">
              加入社区
            </a>
          </div>
        </div>
      </Bleed>
    </>
  );
}
