import Header from '@/app/ui/Header';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/app/lib/categoriies';

const HomePage = () => {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-4xl font-bold mb-8">Explore Categories</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
          {categories.map((category) => (
            <Link key={category.id} href={`/groups/${category.id}`} className="block p-4 bg-white shadow-lg rounded-lg hover:bg-gray-200 transition text-center">
              <Image src={category.image} alt={category.name} width={150} height={150} className="rounded-full mx-auto" />
              <h2 className="mt-4 text-xl font-semibold">{category.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
