/**
 * Profile Page
 * 
 * User profile management page.
 * Allows users to update their profile information and change password.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { useChangePassword } from '@/hooks/useChangePassword';
import { getCurrentUser } from '@/services/api/auth.service';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { getUserTypeLabel } from '@/utils/user.utils';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { updateProfile, loading: updateLoading, error: updateError, clearError: clearUpdateError } = useUpdateProfile();
  const { changeUserPassword, loading: passwordLoading, error: passwordError, clearError: clearPasswordError } = useChangePassword();

  const [profileData, setProfileData] = useState({
    name: '',
    first_name: '',
    last_name: '',
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    profile?: string;
    password?: string;
  }>({});

  // Load current user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setProfileData({
            name: currentUser.name || '',
            first_name: (currentUser as any).first_name || '',
            last_name: (currentUser as any).last_name || '',
          });
        }
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    };

    if (user) {
      // Use user from context first
      setProfileData({
        name: user.name || '',
        first_name: (user as any).first_name || '',
        last_name: (user as any).last_name || '',
      });
    } else {
      loadUser();
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearUpdateError();
    setValidationErrors({});
    setProfileSuccess(null);

    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setProfileSuccess('Profile updated successfully!');
        // Refresh user data in context
        if (refreshUser) {
          await refreshUser();
        }
      }
    } catch (err) {
      // Error already handled in hook
      console.error('Update failed:', err);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    clearPasswordError();
    setValidationErrors({});
    setPasswordSuccess(null);

    // Validate passwords match
    if (passwordData.new_password !== passwordData.confirm_password) {
      setValidationErrors({
        password: 'New passwords do not match',
      });
      return;
    }

    // Validate password length
    if (passwordData.new_password.length < 8) {
      setValidationErrors({
        password: 'New password must be at least 8 characters',
      });
      return;
    }

    // Validate new password is different from old password
    if (passwordData.old_password === passwordData.new_password) {
      setValidationErrors({
        password: 'New password must be different from current password',
      });
      return;
    }

    try {
      const result = await changeUserPassword(
        passwordData.old_password,
        passwordData.new_password
      );

      if (result.success) {
        setPasswordSuccess('Password changed successfully!');
        // Clear form
        setPasswordData({
          old_password: '',
          new_password: '',
          confirm_password: '',
        });
      }
    } catch (err) {
      // Error already handled in hook
      console.error('Password change failed:', err);
    }
  };

  const userTypeLabel = user ? getUserTypeLabel(user.type) : '';
  const avatarSrc = user?.avatar_url || user?.avatar || '/images/user/owner.jpg';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-brand-200 hover:text-brand-500 dark:border-gray-800 dark:text-gray-400 dark:hover:border-brand-500/30 dark:hover:text-brand-300"
              aria-label="Go back"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.25 3.75L6.75 8.25L11.25 12.75"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Profile Settings
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your profile information and account security.
          </p>
        </div>

        {/* User Info Card */}
        {user && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-full">
                <Image
                  width={80}
                  height={80}
                  src={avatarSrc}
                  alt={user.name || 'User'}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.name || 'User'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
                <p className="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400">
                  {userTypeLabel}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Personal Information Section */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h2>

            <form onSubmit={handleProfileUpdate} className="space-y-5">
              {/* Success Message */}
              {profileSuccess && (
                <div className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                  {profileSuccess}
                </div>
              )}

              {/* Error Message */}
              {updateError && (
                <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {updateError}
                </div>
              )}

              {/* Validation Error */}
              {validationErrors.profile && (
                <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {validationErrors.profile}
                </div>
              )}

              {/* Full Name */}
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                />
              </div>

              {/* First Name */}
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  type="text"
                  placeholder="John"
                  value={profileData.first_name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, first_name: e.target.value })
                  }
                />
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  type="text"
                  placeholder="Doe"
                  value={profileData.last_name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, last_name: e.target.value })
                  }
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={updateLoading}
                  className="w-full sm:w-auto"
                >
                  {updateLoading ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
              Change Password
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-5">
              {/* Success Message */}
              {passwordSuccess && (
                <div className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                  {passwordSuccess}
                </div>
              )}

              {/* Error Message */}
              {passwordError && (
                <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {passwordError}
                </div>
              )}

              {/* Validation Error */}
              {validationErrors.password && (
                <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {validationErrors.password}
                </div>
              )}

              {/* Current Password */}
              <div>
                <Label htmlFor="old_password">Current Password</Label>
                <Input
                  id="old_password"
                  type="password"
                  placeholder="Enter your current password"
                  value={passwordData.old_password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, old_password: e.target.value })
                  }
                  required
                />
              </div>

              {/* New Password */}
              <div>
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  type="password"
                  placeholder="Enter your new password"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, new_password: e.target.value })
                  }
                  required
                  minLength={8}
                />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  placeholder="Confirm your new password"
                  value={passwordData.confirm_password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirm_password: e.target.value })
                  }
                  required
                  minLength={8}
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full sm:w-auto"
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

