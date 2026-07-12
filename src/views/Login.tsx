import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FieldMessage,
  TextInput,
} from '@dev-dga/react';
import { useAuth } from '@/app/use-auth';
import { useT } from '@/i18n';

export function Login() {
  const t = useT();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    document.title = `${t('login.title')} · ${t('app.name')}`;
  }, [t]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/', { replace: true });
    } else {
      setFailed(true);
    }
  };

  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Card variant="elevated" className="w-full max-w-sm">
        <CardHeader>
          <CardTitle asChild>
            <h1 className="flex items-center gap-2">
              <img src="/favicon.svg" alt="" className="h-6 w-6" />
              {t('login.title')}
            </h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={submit}>
            <TextInput
              label={t('login.username')}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setFailed(false);
              }}
              autoComplete="username"
              required
            />
            <TextInput
              label={t('login.password')}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFailed(false);
              }}
              autoComplete="current-password"
              aria-describedby={failed ? 'login-error' : undefined}
              required
            />
            {failed && (
              <FieldMessage id="login-error" variant="error">
                {t('login.error')}
              </FieldMessage>
            )}
            <Button type="submit" variant="primary">
              {t('login.submit')}
            </Button>
            <FieldMessage id="login-hint" variant="helper">
              {t('login.hint')}
            </FieldMessage>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
