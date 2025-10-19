'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Eye, Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAdminUsers } from '@/lib/api/mock/admin';
import type { AdminUserData } from '@/types/admin';
import ResultModal from '../ResultModal';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const t = useTranslations('admin');

  useEffect(() => {
    // Check authentication
    const authenticated = localStorage.getItem('admin_authenticated');
    if (!authenticated) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);

    // Load users
    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    const data = await getAdminUsers();
    setUsers(data);
    setFilteredUsers(data);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.surname.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        user.licenseCode.toLowerCase().includes(lowerQuery)
    );
    setFilteredUsers(filtered);
  };

  const handleExportCSV = () => {
    const headers = ['License Code', 'Name', 'Surname', 'Email', 'Grade', 'Gender', 'Test Count'];
    const rows = filteredUsers.map((user) => [
      user.licenseCode,
      user.name,
      user.surname,
      user.email,
      user.grade || '-',
      user.gender || '-',
      user.results.length,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{t('dashboard.title')}</CardTitle>
              <CardDescription>{t('dashboard.description', { count: filteredUsers.length })}</CardDescription>
            </div>
            <Button onClick={handleExportCSV} variant="outline" className="w-full md:w-auto">
              <Download className="w-4 h-4 mr-2" />
              {t('dashboard.exportCSV')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('dashboard.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dashboard.table.licenseCode')}</TableHead>
                  <TableHead>{t('dashboard.table.name')}</TableHead>
                  <TableHead>{t('dashboard.table.email')}</TableHead>
                  <TableHead className="text-center">{t('dashboard.table.grade')}</TableHead>
                  <TableHead className="text-center">{t('dashboard.table.gender')}</TableHead>
                  <TableHead className="text-center">{t('dashboard.table.testResults')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {t('dashboard.noResults')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <Badge variant="outline">{user.licenseCode}</Badge>
                      </TableCell>
                      <TableCell>
                        {user.name} {user.surname}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="text-center">{user.grade || '-'}</TableCell>
                      <TableCell className="text-center">{user.gender || '-'}</TableCell>
                      <TableCell className="text-center">
                        {user.results.length > 0 ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedResultId(user.results[0].id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {t('dashboard.table.viewResults')} ({user.results.length})
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">{t('dashboard.table.noTests')}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Cards - Mobile */}
          <div className="md:hidden space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {t('dashboard.noResults')}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">
                          {user.name} {user.surname}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant="outline">{user.licenseCode}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t('dashboard.table.grade')}:</span>{' '}
                        <span className="font-medium">{user.grade || '-'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('dashboard.table.gender')}:</span>{' '}
                        <span className="font-medium">{user.gender || '-'}</span>
                      </div>
                    </div>

                    {user.results.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setSelectedResultId(user.results[0].id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {t('dashboard.table.viewResults')} ({user.results.length})
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Result Modal */}
      <ResultModal
        resultId={selectedResultId}
        isOpen={selectedResultId !== null}
        onClose={() => setSelectedResultId(null)}
      />
    </div>
  );
}
