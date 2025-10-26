import { Suspense } from "react";
import { Navbar } from "./navbar";
import { TemplatesGallery } from "./templates-gallery";
import { DocumentsTable } from "./document-table";

// Force dynamic rendering for this page since it uses query parameters
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <Suspense fallback={
          <nav className="flex items-center justify-between h-full w-full">
            <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1 mx-4 h-12 bg-gray-100 rounded-full animate-pulse" />
            <div className="flex gap-3">
              <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </nav>
        }>
          <Navbar />
        </Suspense>
      </div>
      <div className="mt-16">
        <TemplatesGallery />
        <Suspense fallback={<div className="p-4">Loading documents...</div>}>
          <DocumentsTable />
        </Suspense>
      </div>
    </div>
  );
}