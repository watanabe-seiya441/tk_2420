import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-900 py-4">
      <div className="container mx-auto text-center flex items-center justify-between">
        {/* ホーム画面に戻るボタン */}
        <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
          ホーム画面に戻る
        </Link>
        
        {/* タイトルを中央に配置 */}
        <h1 className="text-white text-3xl font-bold mx-auto">Oshi no Ko</h1>
        
      </div>
    </header>
  );
};

export default Header;
