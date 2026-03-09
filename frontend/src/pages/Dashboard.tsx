import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, FileText, BarChart3, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <div className="min-h-screen relative">
      {/* Background image with blur overlay */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/assets/image-1.png)',
            filter: 'blur(8px)',
          }}
        />
        <div className="absolute inset-0 bg-emerald-950/80" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-emerald-900/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/generated/portal-logo-transparent.dim_200x200.png"
                  alt="Portal Logo"
                  className="h-12 w-auto"
                />
                <div>
                  <h1 className="text-xl font-bold text-white">Pakistan Digital Landscape Portal</h1>
                  <p className="text-xs text-emerald-200">Ministry Focal Person Dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{userProfile?.email.split('@')[0] || 'User'}</p>
                  <p className="text-xs text-emerald-200">MoITT</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Welcome card */}
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-3xl font-bold">
                  Welcome to the Pakistan Digital Landscape Portal
                </CardTitle>
                <CardDescription className="text-emerald-100 text-base mt-2">
                  Access insights and key information relevant to your ministry.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Action cards grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Start Survey Card */}
              <Card className="backdrop-blur-xl bg-emerald-800/40 border-emerald-600/30 shadow-2xl hover:bg-emerald-800/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-2xl flex items-center gap-2">
                        <FileText className="h-6 w-6 text-emerald-300" />
                        Start Survey
                      </CardTitle>
                      <CardDescription className="text-emerald-100 mt-3 text-base">
                        Begin the 5-section digital landscape assessment. You can save progress and return anytime before submission.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 text-lg group-hover:bg-emerald-500 transition-colors"
                    size="lg"
                  >
                    Start Survey
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              {/* View Analytics Card */}
              <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-2xl flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-emerald-300" />
                        View Analytics
                      </CardTitle>
                      <CardDescription className="text-emerald-100 mt-3 text-base">
                        Ministry-level analytics will become available once the survey is submitted and validated.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-6 text-lg border border-white/30 group-hover:border-white/40 transition-colors"
                    size="lg"
                    disabled
                  >
                    View Analytics
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 backdrop-blur-xl bg-emerald-900/30 mt-16">
          <div className="container mx-auto px-4 py-6">
            <p className="text-emerald-200 text-sm text-center">
              Pakistan Digital Authority © 2024 — For official use only
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
