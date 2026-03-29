'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleIcon, Loader2 } from 'lucide-react';
import { signIn, signUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50" id="main-content">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CircleIcon className="h-12 w-12 text-orange-600" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-950">
          {mode === 'signin'
            ? 'Sign in to your account'
            : 'Create your account'}
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-5" action={formAction} noValidate>
          <input type="hidden" name="redirect" value={redirect || ''} />
          <input type="hidden" name="priceId" value={priceId || ''} />
          <input type="hidden" name="inviteId" value={inviteId || ''} />
          {mode === 'signup' && (
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-900 mb-1.5"
              >
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                className="rounded-full border-gray-400 text-gray-950 placeholder:text-gray-500"
                placeholder="Enter your name"
              />
            </div>
          )}
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-900 mb-1.5"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={state.email}
              required
              maxLength={255}
              className="rounded-full border-gray-400 text-gray-950 placeholder:text-gray-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-900 mb-1.5"
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={
                mode === 'signin' ? 'current-password' : 'new-password'
              }
              defaultValue={state.password}
              required
              minLength={8}
              maxLength={100}
              className="rounded-full border-gray-400 text-gray-950 placeholder:text-gray-500"
              placeholder="Enter your password"
            />
          </div>

          {state?.error && (
            <div className="text-red-700 text-sm font-semibold bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
              {state.error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full rounded-full text-sm font-semibold bg-orange-600 hover:bg-orange-700 text-white focus-visible:ring-orange-500"
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Loading...
              </>
            ) : mode === 'signin' ? (
              'Sign in'
            ) : (
              'Sign up'
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gray-50 text-gray-700 font-medium">
                {mode === 'signin'
                  ? 'New to our platform?'
                  : 'Already have an account?'}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <Link
              href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${
                redirect ? `?redirect=${redirect}` : ''
              }${priceId ? `&priceId=${priceId}` : ''}`}
              className="w-full flex justify-center items-center min-h-[44px] py-2 px-4 border border-gray-400 rounded-full shadow-sm text-sm font-semibold text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 transition-colors"
            >
              {mode === 'signin'
                ? 'Create an account'
                : 'Sign in to existing account'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
