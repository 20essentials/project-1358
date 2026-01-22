import { Background } from '@/components/background';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Background />
      <p className='absolute z-100 top-1/2 left-1/2 -translate-1/2 text-blue-100'>
        You can view the trace at{' '}
        <Link target='_blank' className='underline' href={'https://trace.nextjs.org/'}>https://trace.nextjs.org/</Link>
      </p>
    </>
  );
}
