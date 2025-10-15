'use client';

import { useState, useMemo } from 'react';
import type { Test, UserTest } from '@/types/test';
import type { UserLicenseInfo } from '@/types/organization';
import TestSelector from './TestSelector';
import TestDetailView from './TestDetailView';

interface TestWithProgress extends Test {
  userTest?: UserTest;
}

interface TestsPageContentProps {
  tests: TestWithProgress[];
  licenseInfo: UserLicenseInfo;
}

export default function TestsPageContent({ tests, licenseInfo }: TestsPageContentProps) {
  // Default to the first available test (Holland Test)
  const firstAvailableTest = tests.find(t => t.available) || tests[0];
  const [selectedTestId, setSelectedTestId] = useState(firstAvailableTest.id);

  const selectedTest = useMemo(() => {
    return tests.find(t => t.id === selectedTestId) || firstAvailableTest;
  }, [selectedTestId, tests, firstAvailableTest]);

  return (
    <>
      <TestSelector
        tests={tests}
        selectedTestId={selectedTestId}
        onTestSelect={setSelectedTestId}
        licenseInfo={licenseInfo}
      />
      <TestDetailView test={selectedTest} userTest={selectedTest.userTest} />
    </>
  );
}
