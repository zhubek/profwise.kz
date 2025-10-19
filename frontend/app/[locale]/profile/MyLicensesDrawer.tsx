'use client';

import { useTranslations } from 'next-intl';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserLicense } from '@/types/license';
import { Calendar, Award, CheckCircle, XCircle } from 'lucide-react';

interface MyLicensesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  licenses: UserLicense[];
}

export default function MyLicensesDrawer({ open, onOpenChange, licenses }: MyLicensesDrawerProps) {
  const t = useTranslations('profile.licenses');
  const tCommon = useTranslations('common');

  const isLicenseActive = (license: UserLicense['license']) => {
    const now = new Date();
    const start = new Date(license.startDate);
    const end = new Date(license.expireDate);
    return now >= start && now <= end;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('myLicenses')}</SheetTitle>
          <SheetDescription>
            {t('licensesDescription')}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {licenses.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('noLicenses')}</p>
            </div>
          ) : (
            licenses.map((userLicense) => {
              const active = isLicenseActive(userLicense.license);

              return (
                <Card key={userLicense.id} className={active ? 'border-primary' : 'border-muted'}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {userLicense.license.name}
                          {active ? (
                            <Badge variant="default" className="ml-2">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {t('active')}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="h-3 w-3 mr-1" />
                              {t('expired')}
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {userLicense.license.licenseClass?.name}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* License Code */}
                    <div>
                      <p className="text-xs text-muted-foreground">{t('licenseCode')}</p>
                      <p className="font-mono text-sm font-semibold">{userLicense.license.licenseCode}</p>
                    </div>

                    {/* Organization */}
                    {userLicense.license.organization && (
                      <div>
                        <p className="text-xs text-muted-foreground">{t('organization')}</p>
                        <p className="text-sm">{userLicense.license.organization.name}</p>
                      </div>
                    )}

                    {/* Validity Period */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {formatDate(userLicense.license.startDate)} - {formatDate(userLicense.license.expireDate)}
                      </span>
                    </div>

                    {/* Available Quizzes */}
                    {userLicense.availableQuizzes && userLicense.availableQuizzes.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">{t('availableQuizzes')}</p>
                        <div className="flex flex-wrap gap-2">
                          {userLicense.availableQuizzes.map((quiz) => (
                            <Badge key={quiz.id} variant="outline">
                              {quiz.quizName.en || quiz.quizName.ru || quiz.quizName.kz}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Activation Date */}
                    <div className="pt-2 border-t text-xs text-muted-foreground">
                      {t('activatedOn')}: {formatDate(userLicense.createdAt)}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
