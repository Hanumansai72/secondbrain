'use client';

import { useState } from 'react';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-900 overflow-auto">
      {children}
    </div>
  );
}
