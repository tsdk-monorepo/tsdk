export default function TsdkExamples() {
  return (
    <div>
      <h1 className="mt-10 mb-4 text-center text-[2.5rem] font-bold tracking-tight">Examples</h1>
      <p className="mb-16 text-center text-lg text-slate-500 dark:text-slate-400">
        Some use cases with tsdk
      </p>
      <br />

      <div className="flex flex-col md:flex-row md:flex-wrap">
        <div className="md:w-1/3 p-4 mb-0 md:mb-8">
          <a
            href="/docs/quick-start"
            className="block rounded-xl h-full p-8 shadow md:shadow-lg border border-slate-100 dark:border-slate-800 dark:bg-gray-900 transtion-all duration-500 hover:scale-105">
            <div className="w-24 h-24 rounded-2xl shadow-xl m-auto bg-indigo-50 bg-contain text-5xl flex justify-center items-center">
              🐱
            </div>
            <div className="text-xl font-semibold text-center mt-6">Get started</div>
            <div className="text-center mt-2">
              The tsdk documentation quickstart section corresponds to the example repository code,
              including express.js, Expo, next.js and SWR hooks
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
            <div className="text-xl font-semibold text-center mt-6">TypeORM Demo</div>
            <div className="text-center mt-2">TypeORM usage with tsdk</div>
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
              Follow the Hacker News offical API documentation，Use tsdk to generate API call
              functions and SWR hooks
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
            <div className="text-xl font-semibold text-center mt-6">DrizzleORM</div>
            <div className="text-center mt-2">TypeORM usage with tsdk</div>
          </a>
        </div>
        <div className="md:w-1/3 p-4 mb-0 md:mb-8">
          <a
            href="https://github.com/tsdk-monorepo/tsdk-examples/auth"
            className="block rounded-xl h-full p-8 shadow md:shadow-lg border border-slate-100 dark:border-slate-800 dark:bg-gray-900 transtion-all duration-500 hover:scale-105">
            <div className="w-24 h-24 rounded-2xl shadow-xl m-auto bg-indigo-50 bg-contain text-5xl flex justify-center items-center">
              🐶
            </div>
            <div className="text-xl font-semibold text-center mt-6">Authentication example</div>
            <div className="text-center mt-2">Sign up and Sign in</div>
          </a>
        </div>
        <div className="md:w-1/3 p-4 mb-0 md:mb-8">
          <a
            href="https://github.com/tsdk-monorepo/tsdk-examples/upload"
            className="block rounded-xl h-full p-8 shadow md:shadow-lg border border-slate-100 dark:border-slate-800 dark:bg-gray-900 transtion-all duration-500 hover:scale-105">
            <div className="w-24 h-24 rounded-2xl shadow-xl m-auto bg-indigo-50 bg-contain text-5xl flex justify-center items-center">
              🥕
            </div>
            <div className="text-xl font-semibold text-center mt-6">Upload API with tsdk</div>
            <div className="text-center mt-2"></div>
          </a>
        </div>
        <div className="md:w-1/3 p-4 mb-0 md:mb-8">
          <a
            href="https://github.com/tsdk-monorepo/tsdk-examples/aes-sencrypt-decrypt"
            className="block rounded-xl h-full p-8 shadow md:shadow-lg border border-slate-100 dark:border-slate-800 dark:bg-gray-900 transtion-all duration-500 hover:scale-105">
            <div className="w-24 h-24 rounded-2xl shadow-xl m-auto bg-indigo-50 bg-contain text-5xl flex justify-center items-center">
              ✨
            </div>
            <div className="text-xl font-semibold text-center mt-6">Data encrypt/decrypt</div>
            <div className="text-center mt-2">
              Use AES algorithm to encrypt/decrypt the data example
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
