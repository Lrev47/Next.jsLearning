'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const testimonials = [
    {
      quote: "Next.js has revolutionized how we build React applications. The combination of server components and static site generation gives us incredible performance with minimal effort.",
      author: "Sarah Johnson",
      role: "CTO, TechCorp Inc.",
      company: "techcorp",
    },
    {
      quote: "I've been using Next.js for all my client projects. The built-in routing, API routes, and comprehensive documentation makes it my go-to React framework.",
      author: "Mike Williams",
      role: "Freelance Developer",
      company: "freelance",
    },
    {
      quote: "The developer experience with Next.js is unmatched. Hot reloading, intelligent error handling, and TypeScript support make development a breeze.",
      author: "Priya Patel",
      role: "Lead Frontend Engineer, DataViz",
      company: "dataviz",
    },
    {
      quote: "Our team migrated from a custom React setup to Next.js and we've never looked back. The performance improvements and deployment options saved us countless hours.",
      author: "David Chen",
      role: "VP of Engineering, SaaS Platform",
      company: "saas",
    },
  ];

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setAutoplay(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setAutoplay(true), 10000);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Loved by Developers Worldwide
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            See what teams and individuals are saying about their experience with Next.js.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12"
            >
              <div className="flex flex-col items-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-300 dark:text-primary-700 mb-6 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <blockquote className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-8">
                  "{testimonials[currentIndex].quote}"
                </blockquote>
                <div className="mt-4">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonials[currentIndex].author}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonials[currentIndex].role}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex justify-center items-center space-x-3">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="sr-only">Previous</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700 dark:text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2.5 w-2.5 rounded-full ${
                    index === currentIndex
                      ? 'bg-primary-600 dark:bg-primary-500'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                >
                  <span className="sr-only">{`Testimonial ${index + 1}`}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="sr-only">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700 dark:text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 