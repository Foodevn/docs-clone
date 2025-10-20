"use client";
import Link from "next/link";
import { Navbar } from "./navbar";
import { TemplatesGallery } from "./templates-gallery";
import { useEffect, useState } from "react";
import { DocumentsTable } from "./document-table";

const Home = () => {

  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    // Fetch user info first, then fetch documents
    const fetchDocuments = async () => {
      try {
        // Lấy thông tin user hiện tại
        const userRes = await fetch("/api/auth/me");
        if (!userRes.ok) {
          console.error("Failed to fetch user info");
          return;
        }

        const { user } = await userRes.json();
        const userId = user.id;

        // Lấy documents của user
        const docsRes = await fetch("/api/db/document/getbyid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (!docsRes.ok) {
          console.error("Failed to fetch documents");
          return;
        }

        const data = await docsRes.json();
        setDocuments(data);
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    };

    fetchDocuments();
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