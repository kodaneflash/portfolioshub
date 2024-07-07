'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import MainNav from '@/components/main-nav';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import useScroll from '@/hooks/use-scroll';
import { useSession } from '@/lib/client-auth';
import { cn } from '@/lib/utils';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { MessageSquareMore, Send } from 'lucide-react';

import FeedbackForm from './forms/feedback-form';
import SubmissionForm from './forms/submission-form';

export function Header() {
  const pathname = usePathname();
  const session = useSession();
  const scrolled = useScroll(70);
  const [isSubimtOpen, setIsSubimtOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const isAdmin = useQuery(api.users.isAdmin);
  const isHome = pathname === '/';
  return (
    <>
      <header
        className={cn(
          `inset-x-0 top-0 z-30 w-full transition-all duration-300 sticky`,
          {
            'border-b border-accent bg-background/75 backdrop-blur-lg sticky':
              scrolled,
          },
        )}
      >
        <nav className="w-full h-16 items-center flex sm:container mx-auto  px-4">
          <div className="w-full items-center flex flex-row justify-between">
            <div className="flex flex-row items-center gap-6">
              <MainNav />
              {session.isLoggedIn && pathname !== '/' && (
                <div className="hidden md:flex flex-row gap-4 text-sm">
                  <Link
                    href="/dashboard"
                    className={cn(
                      'text-muted-foreground hover:text-foreground  hover:duration-200',
                      pathname === '/dashboard' &&
                        'font-semibold text-foreground',
                    )}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/favorites"
                    className={cn(
                      'text-muted-foreground hover:text-foreground hover:duration-200',
                      pathname === '/favorites' &&
                        'font-semibold text-foreground',
                    )}
                  >
                    Favorites
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={cn(
                        'text-muted-foreground hover:text-foreground hover:duration-200',
                        pathname === '/admin' &&
                          'font-semibold text-foreground',
                      )}
                    >
                      Admin
                    </Link>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-row items-center gap-2">
              {session.isLoggedIn ? (
                <>
                  {isHome ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsSubimtOpen(true)}
                        className="flex gap-2"
                      >
                        <Send size={16} />
                        <span className="hidden sm:inline">Submit</span>
                      </Button>
                      <Button size="sm" asChild className="hidden md:flex">
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFeedbackOpen(true)}
                        className="flex gap-2"
                      >
                        <MessageSquareMore size={16} />
                        <span className="hidden sm:inline">Feedback</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setIsSubimtOpen(true)}
                        className="flex gap-2"
                      >
                        <Send size={16} />
                        <span className="hidden sm:inline">Submit</span>
                      </Button>
                      <div className="hidden md:flex md:ml-2">
                        <UserButton />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsSubimtOpen(true)}
                    className="flex gap-2"
                  >
                    <Send size={16} />
                    <span className="hidden sm:inline">Submit</span>
                  </Button>
                  <Button size="sm" asChild>
                    <SignInButton mode="modal">Login</SignInButton>
                  </Button>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>
      <ResponsiveDialog
        open={isFeedbackOpen}
        setOpen={setIsFeedbackOpen}
        header="Feedback"
      >
        <FeedbackForm setOpen={setIsFeedbackOpen} />
      </ResponsiveDialog>

      <ResponsiveDialog
        open={isSubimtOpen}
        setOpen={setIsSubimtOpen}
        header="Submit a portfolio"
      >
        <SubmissionForm setOpen={setIsSubimtOpen} />
      </ResponsiveDialog>
    </>
  );
}
