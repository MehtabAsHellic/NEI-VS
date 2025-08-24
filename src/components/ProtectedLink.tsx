import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Lock } from 'lucide-react';

interface ProtectedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  requireAuth?: boolean;
  showLockIcon?: boolean;
}

const ProtectedLink: React.FC<ProtectedLinkProps> = ({ 
  href, 
  children, 
  className = '',
  requireAuth = true,
  showLockIcon = false
}) => {
  const { isAuthenticated, isInitialized } = useAuthStore();

  const handleClick = (e: React.MouseEvent) => {
    if (requireAuth && !isAuthenticated && isInitialized) {
      e.preventDefault();
      // Show a more user-friendly message
      const shouldSignIn = window.confirm(
        'Please sign in with Google to access this feature. Would you like to go to the sign-in page?'
      );
      if (shouldSignIn) {
        window.location.href = '/';
      }
      return;
    }
    
    // For authenticated users or non-protected links, navigate normally
    if (href.startsWith('#')) {
      // Handle hash navigation
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href.startsWith('/')) {
      // Handle internal navigation
      e.preventDefault();
      window.location.href = href;
    }
  };

  const isDisabled = requireAuth && !isAuthenticated && isInitialized;

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${className} ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} transition-all`}
      title={isDisabled ? 'Sign in required' : undefined}
    >
      <span className="flex items-center space-x-1">
        {showLockIcon && isDisabled && <Lock className="h-3 w-3" />}
        <span>{children}</span>
      </span>
    </a>
  );
};

export default ProtectedLink;