"use client";

import { Document } from "./document";

interface DocumentIdPageProps {
  params: Promise<{ documentId: string }>
};

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = await params;
  return <Document documentId={documentId} />
}

export default DocumentIdPage;