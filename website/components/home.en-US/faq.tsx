import Link from 'next/link';

import ArrowDown from '../ArrowDown';
import { FAQs } from '../FAQ.en-US';

export default function FAQ() {
  return (
    <div className="py-24 px-8 lg:px-48 bg-wave-2">
      <h3 className="text-slate-900 dark:text-slate-200 font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-center mb-8 md:mb-16">
        Frequently Asked Questions
      </h3>
      <div className="flex flex-col lg:flex-row lg:flex-wrap gap-y-8">
        {FAQs.slice(0, 4).map((item, idx) => {
          return (
            <div className="w-full lg:w-1/2 lg:px-4" key={idx}>
              <div
                className="border-b text-slate-700 dark:text-slate-300 dark:border-slate-500 list-disc list-item accordion-item"
                tabIndex={1}>
                <div className="flex py-4 items-center cursor-pointer">
                  <div className="flex-1">{item.q}</div>
                  <div>
                    <ArrowDown />
                  </div>
                </div>

                <div className="text-normal pt-2 pb-6 text-slate-800 dark:text-slate-400 accordion-content">
                  {item.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-24">
        <Link
          href="/docs/faq"
          className="focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-sky-500 border border-slate-300 hover:bg-sky-500 hover:text-white font-semibold h-12 px-6 rounded-lg flex items-center justify-center sm:w-auto  transition-all dark:border-slate-600">
          See more
        </Link>
      </div>
    </div>
  );
}
