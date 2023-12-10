export const FAQs = [
  {
    q: '类型安全，到底什么是类型安全接口？',
    a: (
      <>
        从传统的 API 开发流程来说，后端写好接口和文档，前端根据文档使用 `fetch` 或 `axios`
        再手动包一层；
        <div className="mt-2">
          而类型安全的接口，当接口写好，将省略掉手动封装这一步骤，前端直接导入模块调用接口函数即可。
        </div>
      </>
    ),
  },
  {
    q: 'tsdk 可以在生产上使用了吗？',
    a: `可以。tsdk 经过长年累月默默耕耘，API 已非常精简；如果您在生产中使用过
    Express.js，那么使用 tsdk 上生产也没问题。`,
  },
  {
    q: `tRPC 和 tsdk 有什么不同？`,
    a: (
      <>
        tRPC 和 tsdk 都可以做到类型安全的 API
        开发，但是两者的实现方式不一样，而且提供的其他功能也有所区别。
        <br />
        总之，tRPC 很棒，而 tsdk 提供另一个选项。
      </>
    ),
  },
  {
    q: `Next.js 的 Server Actions 已经是类型安全的，还需要 tsdk 吗？`,
    a: `如果您的前后端代码都可以写在 Next.js 项目里，则不需要使用 tsdk；而当需要前后端服务代码分离时，则可以使用 tsdk。`,
  },
  {
    q: `GraphQL 和 tsdk 对比？`,
    a: (
      <>
        GraphQL 是一种数据查询语言，而 tsdk 是一个用来共享代码和开发类型安全 API
        的轻量级库，两者是不同的东西。
      </>
    ),
  },
  {
    q: `tsdk 目前的缺点和优点？`,
    a: (
      <>
        缺点：
        <br />
        1. 接口配置不能重复；
        <br />
        2. 步骤相对繁琐：定义接口配置（APIConfig） {'->'} 定义接口 {'->'} 再运行命令同步模块。
        <br />
        <br />
        优点：
        <br />
        1. 因为接口是基于配置，而配置相当于是接口的核心数据，比较灵活；
        <br />
        2. 不仅仅是类型安全的接口，也支持共享代码；
        <br />
        3. 接口函数导出，以及 SWR 或者 React Query Hooks 导出。
      </>
    ),
  },
  {
    q: '更多',
    a: (
      <>
        如果您有任何地疑问或者建议，欢迎您反馈到{' '}
        <a
          className="text-blue-500 px-2 capitalize"
          href="https://github.com/tsdk-monorepo/tsdk/issues">
          issue
        </a>
        或者加入讨论
        <a
          className="text-blue-500 px-2 capitalize"
          href="https://github.com/tsdk-monorepo/tsdk/discussions/categories/q-a">
          discussions
        </a>
      </>
    ),
  },
];

export default function FAQPart() {
  return (
    <div>
      {FAQs.map((item, idx) => {
        return (
          <div key={idx} className="my-12">
            <h3 className="text-2xl font-bold mb-4 text-inherit list-item list-disc">{item.q}</h3>
            <div>{item.a}</div>
          </div>
        );
      })}
    </div>
  );
}
