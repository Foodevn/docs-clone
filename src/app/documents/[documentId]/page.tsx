import { redirect } from "next/navigation";
import { Document } from "./document";
import { getDocumentById } from "./actions";

interface DocumentIdPageProps {
  params: Promise<{ documentId: string }>;
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = await params;

  // Get document with authentication check
  const document = await getDocumentById(documentId);

  if (!document) {
    redirect("/");
  }

  return <Document preloadedDocument={document} />;
};

export default DocumentIdPage;