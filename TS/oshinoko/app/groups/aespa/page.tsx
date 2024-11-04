import Header from '@/app/ui/Header';
import VideoUpload from '@/app/ui/VideoUpload';
import EnhancedVideoPlayer from '@/app/ui/EnhancedVideoPlayer';

const AespaPage = () => {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-4xl font-bold">Aespa</h1>
        <p className="mt-4 text-lg text-gray-700">A K-pop girl group from SM Entertainment.</p>
        <VideoUpload />

        {/* Add more content for Aespa here, such as video upload or other features */}
        {/* Enhanced Video Player */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Watch Aespa’s Latest Video</h2>
          <EnhancedVideoPlayer src="/dev/test.mp4" overlayConfigUrl="/dev/nameplates.json" originalVideoWidth={640} originalVideoHeight={360} />
        </div>
      </div>
    </main>
  );
};

export default AespaPage;
