import { Link } from "react-router-dom";
import { usePageTitle } from '@/hooks/usePageTitle';

const NotFound = () => {
  
  usePageTitle('Halaman Tidak Ditemukan');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Halaman tidak ditemukan</p>
        <Link to="/" className="text-primary underline underline-offset-4">
          Kembali ke website laundry
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
