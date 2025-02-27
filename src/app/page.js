import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import CodeShowcase from '@/components/home/CodeShowcase';
import Testimonials from '@/components/home/Testimonials';
import CTA from '@/components/home/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <CodeShowcase />
      <Testimonials />
      <CTA />
    </>
  );
}
