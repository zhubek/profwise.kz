'use client';

import { useAuth } from '@/contexts/AuthContext';
import LicenseCodeModal from './LicenseCodeModal';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { needsLicenseCode, setNeedsLicenseCode } = useAuth();

  return (
    <>
      {children}
      <LicenseCodeModal
        open={needsLicenseCode}
        onOpenChange={(open) => {
          if (!open) {
            setNeedsLicenseCode(false);
          }
        }}
      />
    </>
  );
}
