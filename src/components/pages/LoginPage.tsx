import { useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

export function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
        if (isRegistering) {
            // Registration is currently mock-only as backend doesn't support user creation
            // We'll warn the user that this is a local-only session
             if (password !== confirmPassword) {
                alert("Passwords do not match"); 
                setIsLoading(false);
                return;
             }
             // Create a mock token for registration (Note: This will likely fail API calls)
             register({
                id: crypto.randomUUID(),
                name: email.split('@')[0],
                email: email,
                role: 'user'
             });
        } else {
            // Login: Exchange "Password" (treated as API Key) for JWT
            // Note: In a real app, we'd have a separate login endpoint for user/pass
            // For now, we use the /auth/token endpoint which expects X-API-Key
            
            // We use the omegaClient directly here, but we need to bypass the interceptor 
            // or just ensure we pass the header.
            
            // Dynamic import to avoid circular dependency if any (safe here)
            const { omegaClient } = await import('@/lib/api/client');
            
            interface TokenResponse {
                access_token: string;
                token_type: string;
            }

            const response = await omegaClient.post<TokenResponse>('/auth/token', {}, {
                headers: {
                    'X-API-Key': password
                }
            });

            if (response.access_token) {
                login(response.access_token, {
                    id: '1', // Backend doesn't return user info yet
                    name: 'Omega Commander',
                    email: email,
                    role: 'admin'
                });
            } else {
                 alert("Login failed: No token received");
            }
        }
    } catch (error: any) {
        console.error("Authentication error:", error);
        alert(`Authentication failed: ${error.message || 'Invalid credentials'}`);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] animate-pulse delay-1000" />

      <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/50 shadow-lg shadow-primary/20">
                <ShieldCheck className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-base">
            {isRegistering ? 'Join the Omega Control Plane' : 'Authenticate to access the Omega Control Plane'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="relative group">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  placeholder="name@omegakg.io"
                  className="pl-9 bg-background/50 border-white/5 focus:bg-background/80 transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative group">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="password"
                  placeholder="API Key (or Password)"
                  className="pl-9 bg-background/50 border-white/5 focus:bg-background/80 transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {isRegistering && (
                <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                  <div className="relative group">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      className="pl-9 bg-background/50 border-white/5 focus:bg-background/80 transition-all duration-300"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
            )}
            
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                disabled={isLoading || !email || !password || (isRegistering && !confirmPassword)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRegistering ? 'Creating Account...' : 'Authenticating...'}
                </>
              ) : (
                <>
                  {isRegistering ? 'Sign Up' : 'Sign In'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            
            <div className="text-xs text-center text-muted-foreground space-y-2">
                <p>Authorized personnel only. All actions are logged.</p>
                <div className="pt-2 border-t border-white/10 w-full flex justify-center">
                    <button 
                        type="button"
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                        }}
                        className="text-primary hover:underline hover:text-primary/80 transition-colors"
                    >
                        {isRegistering ? 'Already have an account? Sign In' : 'Need access? Create an account'}
                    </button>
                </div>
            </div>
          </CardFooter>
        </form>
      </Card>
      
      {/* Footer Branding */}
      <div className="absolute bottom-8 text-center">
        <p className="text-xs text-muted-foreground font-medium tracking-widest opacity-50">
            PRIMUS • CORTEX • BRIDGE
        </p>
      </div>
    </div>
  );
}
