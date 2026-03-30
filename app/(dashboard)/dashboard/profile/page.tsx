'use client';

import { useActionState, Suspense, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { updateProfile } from '@/app/(login)/actions';
import { User } from '@/lib/db/schema';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BIBLE_TRANSLATIONS = [
  { value: 'NIV', label: 'NIV — New International Version' },
  { value: 'KJV', label: 'KJV — King James Version' },
  { value: 'ESV', label: 'ESV — English Standard Version' },
  { value: 'NLT', label: 'NLT — New Living Translation' },
  { value: 'NASB', label: 'NASB — New American Standard Bible' },
  { value: 'CSB', label: 'CSB — Christian Standard Bible' },
  { value: 'NKJV', label: 'NKJV — New King James Version' },
  { value: 'MSG', label: 'MSG — The Message' },
];

type ActionState = {
  name?: string;
  bio?: string;
  preferredBibleTranslation?: string;
  error?: string;
  success?: string;
};

type ProfileFormProps = {
  state: ActionState;
  nameValue?: string;
  bioValue?: string;
  translationValue?: string;
};

function ProfileForm({ state, nameValue = '', bioValue = '', translationValue = '' }: ProfileFormProps) {
  const resolvedName = state.name ?? nameValue;
  const resolvedBio = state.bio ?? bioValue;
  const resolvedTranslation = state.preferredBibleTranslation ?? translationValue;

  return (
    <>
      <div>
        <Label htmlFor="name" className="mb-2">
          Display Name
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your display name"
          defaultValue={resolvedName}
          required
        />
      </div>

      <div>
        <Label htmlFor="bio" className="mb-2">
          Bio
        </Label>
        <textarea
          id="bio"
          name="bio"
          placeholder="Tell others a little about yourself..."
          defaultValue={resolvedBio}
          maxLength={500}
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
        />
      </div>

      <div>
        <Label htmlFor="preferredBibleTranslation" className="mb-2">
          Preferred Bible Translation
        </Label>
        <select
          id="preferredBibleTranslation"
          name="preferredBibleTranslation"
          defaultValue={resolvedTranslation}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Select a translation</option>
          {BIBLE_TRANSLATIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

function ProfileFormWithData({ state }: { state: ActionState }) {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  return (
    <ProfileForm
      state={state}
      nameValue={user?.name ?? ''}
      bioValue={user?.bio ?? ''}
      translationValue={user?.preferredBibleTranslation ?? ''}
    />
  );
}

export default function ProfilePage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateProfile,
    {}
  );

  useEffect(() => {
    if (state.success) {
      mutate('/api/user');
    }
  }, [state.success]);

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Profile
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={formAction}>
            <Suspense fallback={<ProfileForm state={state} />}>
              <ProfileFormWithData state={state} />
            </Suspense>

            {state.error && (
              <p className="text-red-700 text-sm font-medium" role="alert">
                {state.error}
              </p>
            )}
            {state.success && (
              <p className="text-green-800 text-sm font-medium" role="status">
                {state.success}
              </p>
            )}

            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
