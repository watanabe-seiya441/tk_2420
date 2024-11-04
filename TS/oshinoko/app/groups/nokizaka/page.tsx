import Header from '@/app/ui/Header';
import VideoUpload from '@/app/ui/VideoUpload';

const AespaPage = () => {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-4xl font-bold">Nokizaka</h1>
        <p className="mt-4 text-lg text-gray-700">A J-pop girl group.</p>
        <VideoUpload />
        {/* Add more content for Aespa here, such as video upload or other features */}
      </div>
    </main>
  );
};

export default AespaPage;
