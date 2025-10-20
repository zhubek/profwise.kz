'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, Search, Download, Loader2 } from 'lucide-react';
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
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import type { AdminUserData } from '@/types/admin';
import ResultModal from '../ResultModal';

interface License {
  id: string;
  name: string;
  licenseCode: string;
  startDate: string;
  expireDate: string;
  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
    grade: string | null;
    age: number | null;
  } | null;
}

export default function AdminDashboardPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [filteredLicenses, setFilteredLicenses] = useState<License[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { organization } = useAdminAuth();
  const t = useTranslations('admin');

  useEffect(() => {
    loadLicenses();
  }, []);

  const loadLicenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setError('No admin token found');
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://172.26.195.243:4000';
      const response = await fetch(`${API_URL}/admin-auth/licenses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch licenses');
      }

      const data = await response.json();
      setLicenses(data);
      setFilteredLicenses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load licenses');
      console.error('Error loading licenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredLicenses(licenses);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = licenses.filter(
      (license) =>
        license.licenseCode.toLowerCase().includes(lowerQuery) ||
        license.name.toLowerCase().includes(lowerQuery) ||
        (license.user?.name.toLowerCase().includes(lowerQuery)) ||
        (license.user?.surname.toLowerCase().includes(lowerQuery)) ||
        (license.user?.email.toLowerCase().includes(lowerQuery))
    );
    setFilteredLicenses(filtered);
  };

  const handleExportCSV = () => {
    const headers = ['License Code', 'License Name', 'User Name', 'Email', 'Grade', 'Status', 'Expires'];
    const rows = filteredLicenses.map((license) => [
      license.licenseCode,
      license.name,
      license.user ? `${license.user.name} ${license.user.surname}` : 'Not Activated',
      license.user?.email || '-',
      license.user?.grade || '-',
      license.user ? 'Activated' : 'Available',
      new Date(license.expireDate).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `licenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              <p className="text-muted-foreground">Loading licenses...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadLicenses}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activatedCount = licenses.filter(l => l.user !== null).length;
  const totalCount = licenses.length;

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
      {/* Organization Info */}
      {organization && (
        <Card className="mb-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">{organization.name}</h2>
            <div className="flex gap-4 text-sm opacity-90">
              <span>Type: {organization.type}</span>
              <span>•</span>
              <span>Licenses: {activatedCount} / {totalCount} activated</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">License Management</CardTitle>
              <CardDescription>
                {filteredLicenses.length} {filteredLicenses.length === 1 ? 'license' : 'licenses'} found
              </CardDescription>
            </div>
            <Button onClick={handleExportCSV} variant="outline" className="w-full md:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by license code, name, or user..."
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
                  <TableHead>License Code</TableHead>
                  <TableHead>License Name</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLicenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No licenses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLicenses.map((license) => (
                    <TableRow key={license.id}>
                      <TableCell className="font-medium">
                        <Badge variant="outline">{license.licenseCode}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{license.name}</TableCell>
                      <TableCell>
                        {license.user ? (
                          `${license.user.name} ${license.user.surname}`
                        ) : (
                          <span className="text-muted-foreground italic">Not activated</span>
                        )}
                      </TableCell>
                      <TableCell>{license.user?.email || '-'}</TableCell>
                      <TableCell className="text-center">{license.user?.grade || '-'}</TableCell>
                      <TableCell className="text-center">
                        {license.user ? (
                          <Badge className="bg-green-500">Activated</Badge>
                        ) : (
                          <Badge variant="secondary">Available</Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(license.expireDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Cards - Mobile */}
          <div className="md:hidden space-y-4">
            {filteredLicenses.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No licenses found
              </div>
            ) : (
              filteredLicenses.map((license) => (
                <Card key={license.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{license.name}</p>
                        <Badge variant="outline" className="mt-1">{license.licenseCode}</Badge>
                      </div>
                      {license.user ? (
                        <Badge className="bg-green-500">Activated</Badge>
                      ) : (
                        <Badge variant="secondary">Available</Badge>
                      )}
                    </div>

                    {license.user && (
                      <div className="space-y-1">
                        <p className="font-medium">
                          {license.user.name} {license.user.surname}
                        </p>
                        <p className="text-sm text-muted-foreground">{license.user.email}</p>
                        {license.user.grade && (
                          <p className="text-sm">Grade: {license.user.grade}</p>
                        )}
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground">
                      Expires: {new Date(license.expireDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
