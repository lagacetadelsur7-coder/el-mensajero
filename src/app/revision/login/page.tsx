export const runtime = 'nodejs';
import LoginForm from './LoginForm';
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const error = searchParams?.error;
  return <LoginForm error={error} />;
}
