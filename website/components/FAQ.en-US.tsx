export const FAQs = [
  {
    q: 'What is a type-safe API?',
    a: (
      <>
        In traditional development, the backend engineer writes the API and writes the relevant
        documents. Then, the frontend developer writes the request API function based on the
        documentation.
        <div className="mt-2">
          However, in type-safe API development, once the backend API is finished, the frontend
          merely needs to install the API module and import the API function, eliminating the need
          for any manual wrap code.
        </div>
      </>
    ),
  },
  {
    q: 'Is tsdk production ready?',
    a: `Yes! tsdk has worked on the API for several years resulting in a streamlined process. If you have experience using Express.js in production, you will have no difficulties using tsdk in production.`,
  },
  {
    q: `What's the difference between tRPC and tsdk?`,
    a: (
      <>
        Both tRPC and tsdk can do type-safe API development, but they are implemented differently
        and offer different other features.
        <br />
        In short, tRPC is great, while tsdk provides another option.
      </>
    ),
  },
  {
    q: `Next.js Server Actions are already type-safe, do we need tsdk?`,
    a: `If your front-end and back-end code can be written inside Next.js, you don't need to use tsdk; when you need to separate front-end and back-end services, you can use tsdk.`,
  },
  {
    q: `Compare GraphQL and tsdk?`,
    a: (
      <>
        GraphQL, is a data query language, and tsdk is a lightweight library for sharing code and
        developing type-safe APIs. They are different things.
      </>
    ),
  },
  {
    q: `What are the cons and pros of tsdk so far?`,
    a: (
      <>
        Pros:
        <br />
        1. API configuration cannot be duplicated;
        <br />
        2. The steps are relatively tedious: define the API configuration (API Config) {'->'} setup
        the API with config {'->'} and run the scripts sync module.
        <br />
        <br />
        Cons：
        <br />
        1. Because API are based on configurations, which are equivalent to the core data of the
        API, they are more flexible;
        <br />
        2. Support share code;
        <br />
        3. Codegen: API functions exports, and SWR or React Query Hooks generate.
      </>
    ),
  },
  {
    q: 'More questions',
    a: (
      <>
        If you have any other questions or suggestions, feel free to contact us at{' '}
        <a
          className="text-blue-500 px-2 capitalize"
          href="https://github.com/tsdk-monorepo/tsdk/issues">
          issue
        </a>{' '}
        Or join the{' '}
        <a
          className="text-blue-500 px-2 capitalize"
          href="https://github.com/tsdk-monorepo/tsdk/discussions/categories/q-a">
          discussions
        </a>{' '}
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
