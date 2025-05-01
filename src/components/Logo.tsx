
import { Link } from 'react-router-dom';

const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
  };

  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="relative">
        <span className="text-3xl font-bold text-gradient-orange">E</span>
        <span className="text-xl font-bold text-eprojects-white">PROJECTS</span>
      </div>
    </Link>
  );
};

export default Logo;
