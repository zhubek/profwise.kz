'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { verifyEmail } from '@/lib/api/auth';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError('Invalid verification link');
      setVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setSuccess(true);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Verification failed');
        setSuccess(false);
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            {verifying ? (
              <div className="p-3 rounded-full bg-primary/10">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
            ) : success ? (
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            ) : (
              <div className="p-3 rounded-full bg-destructive/10">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl md:text-3xl text-center">
            {verifying ? 'Verifying Email' : success ? 'Email Verified!' : 'Verification Failed'}
          </CardTitle>
          <CardDescription className="text-center">
            {verifying && 'Please wait while we verify your email address...'}
            {success && 'Your email has been successfully verified. You can now log in.'}
            {error && error}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!verifying && (
            <div className="space-y-3">
              {success ? (
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full"
                  size="lg"
                >
                  Go to Login
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => router.push('/register')}
                    className="w-full"
                    size="lg"
                  >
                    Try Again
                  </Button>
                  <div className="text-center text-sm">
                    <span className="text-muted-foreground">Need help? </span>
                    <Link href="/login" className="text-primary hover:underline font-medium">
                      Contact Support
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
