import { useEffect, useRef } from 'react';

export function useScrollReveal(options = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          // Optional: stop observing once revealed
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Apply initial hide class if not already there
    if (!element.classList.contains('reveal')) {
      element.classList.add('reveal');
    }

    // Find children with staggered reveal
    const staggeredChildren = element.querySelectorAll('.reveal-child');
    if (staggeredChildren.length > 0) {
      observer.observe(element);
    } else {
      observer.observe(element);
    }

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options]);

  return elementRef;
}
