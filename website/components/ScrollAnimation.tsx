'use client';

import { useEffect } from 'react';

function checkInView(el: Element) {
  const rect = el.getBoundingClientRect();
  return rect.top + 1 < document.body.scrollTop + window.innerHeight;
}

function check() {
  document.querySelectorAll('[data-scroll-active]').forEach((item) => {
    const cls = item.getAttribute('data-scroll-active');
    if (cls && cls !== 'done' && checkInView(item)) {
      item.classList.toggle(cls);
      item.setAttribute('data-scroll-active', 'done');
    }
  });
}

export default function ScrollAnimation(props: { children?: React.ReactNode }) {
  useEffect(() => {
    check();
    window.addEventListener('scroll', check);
    return () => {
      window.removeEventListener('scroll', check);
    };
  }, []);
  return props.children;
}
