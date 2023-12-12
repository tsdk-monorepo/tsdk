export default function TsdkExamples() {
  return (
    <div>
      <h1 className="mt-10 mb-4 text-center text-[2.5rem] font-bold tracking-tight">🌰 例子</h1>
      <p className="mb-16 text-center text-lg text-slate-500 dark:text-slate-400">tsdk 使用实例</p>
      <br />

      <div className="flex flex-col md:flex-row md:flex-wrap">
        <div className="md:w-1/3 p-4 mb-0 md:mb-8">
          <a
            href="/docs/quick-start"
            className="block rounded-xl h-full p-8 shadow md:shadow-lg border border-slate-100 dark:border-slate-800 dark:bg-gray-900 transtion-all duration-500 hover:scale-105">
            <div className="w-24 h-24 rounded-2xl shadow-xl m-auto bg-indigo-50 bg-contain text-5xl flex justify-center items-center">
              🐶
            </div>
            <div className="text-xl font-semibold text-center mt-6">快速开始</div>
            <div className="text-center mt-2">
              tsdk 文档快速开始部分对应的例子仓库代码，包括 express，expo，next.js 和 SWR hooks 使用
            </div>
          </a>
        </div>
        <div className="md:w-1/3 p-4 mb-0 md:mb-8">
          <a
            href="https://github.com/tsdk-monorepo/with-typeorm-example"
            className="block rounded-xl h-full p-8 shadow md:shadow-lg border border-slate-100 dark:border-slate-800 dark:bg-gray-900 transtion-all duration-500 hover:scale-105">
            <div
              className="w-24 h-24 rounded-2xl shadow-xl m-auto bg-indigo-50 bg-contain text-5xl flex justify-center items-center"
              style={{ backgroundImage: `url("/examples/typeorm.png")` }}></div>
            <div className="text-xl font-semibold text-center mt-6">TypeORM 例子</div>
            <div className="text-center mt-2">
              TypeORM 配合 tsdk 一起使用，包含 Expo（React Native），next.js 和 SWR 使用
            </div>
          </a>
        </div>
        <div className="md:w-1/3 p-4 mb-0 md:mb-8">
          <a
            href="https://github.com/tsdk-monorepo/hacker-news-api"
            className="block rounded-xl h-full p-8 shadow md:shadow-lg border border-slate-100 dark:border-slate-800 dark:bg-gray-900 transtion-all duration-500 hover:scale-105">
            <div
              className="w-24 h-24 rounded-2xl shadow-xl m-auto bg-indigo-50 bg-contain text-5xl flex justify-center items-center"
              style={{ backgroundImage: `url("/examples/hn.png")` }}></div>
            <div className="text-xl font-semibold text-center mt-6">HackerNews API</div>
            <div className="text-center mt-2">
              根据 Hacker News 的 API 文档，使用 tsdk 生成可在前端直接使用的 API 函数和 SWR Hooks
            </div>
          </a>
        </div>
        <div className="md:w-1/3 p-4 mb-0 md:mb-8">
          <a
            href="https://github.com/tsdk-monorepo/with-drizzle-orm-example"
            className="block rounded-xl h-full p-8 shadow md:shadow-lg border border-slate-100 dark:border-slate-800 dark:bg-gray-900 transtion-all duration-500 hover:scale-105">
            <div
              className="w-24 h-24 rounded-2xl shadow-xl m-auto bg-indigo-50 bg-contain text-5xl flex justify-center items-center"
              style={{ backgroundImage: `url("/examples/drizzleorm.png")` }}></div>
            <div className="text-xl font-semibold text-center mt-6">DrizzleORM 例子</div>
            <div className="text-center mt-2">
              Drizzle ORM 配合 tsdk 一起使用，包含 Expo（React Native），next.js 和 React Query
              使用例子
            </div>
          </a>
        </div>
        <div className="md:w-1/3 p-4 mb-0 md:mb-8">
          <a
            href="https://github.com/tsdk-monorepo/tsdk-examples/auth"
            className="block rounded-xl h-full p-8 shadow md:shadow-lg border border-slate-100 dark:border-slate-800 dark:bg-gray-900 transtion-all duration-500 hover:scale-105">
            <div className="w-24 h-24 rounded-2xl shadow-xl m-auto bg-indigo-50 bg-contain text-5xl flex justify-center items-center">
              😾
            </div>
            <div className="text-xl font-semibold text-center mt-6">注册和登录</div>
            <div className="text-center mt-2"></div>
          </a>
        </div>
        <div className="md:w-1/3 p-4 mb-0 md:mb-8">
          <a
            href="https://github.com/tsdk-monorepo/tsdk-examples/upload"
            className="block rounded-xl h-full p-8 shadow md:shadow-lg border border-slate-100 dark:border-slate-800 dark:bg-gray-900 transtion-all duration-500 hover:scale-105">
            <div className="w-24 h-24 rounded-2xl shadow-xl m-auto bg-indigo-50 bg-contain text-5xl flex justify-center items-center">
              🐱
            </div>
            <div className="text-xl font-semibold text-center mt-6">上传 API</div>
            <div className="text-center mt-2"></div>
          </a>
        </div>
        <div className="md:w-1/3 p-4 mb-0 md:mb-8">
          <a
            href="https://github.com/tsdk-monorepo/tsdk-examples/aes-sencrypt-decrypt"
            className="block rounded-xl h-full p-8 shadow md:shadow-lg border border-slate-100 dark:border-slate-800 dark:bg-gray-900 transtion-all duration-500 hover:scale-105">
            <div className="w-24 h-24 rounded-2xl shadow-xl m-auto bg-indigo-50 bg-contain text-5xl flex justify-center items-center">
              😾
            </div>
            <div className="text-xl font-semibold text-center mt-6">传输加解密</div>
            <div className="text-center mt-2">使用 AES 算法加解密传输的数据</div>
          </a>
        </div>
      </div>
    </div>
  );
}
