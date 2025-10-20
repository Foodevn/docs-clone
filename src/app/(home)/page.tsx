"use client";
import Link from "next/link";
import { Navbar } from "./navbar";
import { TemplatesGallery } from "./templates-gallery";
import { useEffect, useState } from "react";
import { DocumentsTable } from "./document-table";

const Home = () => {

  const [documents, setDocuments] = useState<any[]>([]);
  useEffect(() => {
    // Fetch documents from the API
    fetch("/api/db/document/get-all")
      .then((res) => res.json())
      .then((data) => setDocuments(data))
      .catch((err) => console.error("Error fetching documents:", err));
  }, []);

  if (documents === undefined) {
    return (
      <p>Loading...</p>
    )
  }
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <Navbar />
      </div>
      <div className="mt-16">
        <TemplatesGallery />

        <DocumentsTable
          documents={documents}
        // loadMore={loadMore}
        // status={status}
        />
      </div>
    </div>
  );
}

export default Home;