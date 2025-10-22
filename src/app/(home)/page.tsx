"use client";
import Link from "next/link";
import { Navbar } from "./navbar";
import { TemplatesGallery } from "./templates-gallery";
import { useEffect, useState } from "react";
import { DocumentsTable } from "./document-table";
import { useSearchParam } from "@/hooks/use-search-param";

const Home = () => {
  const [documents, setDocuments] = useState();
  const [search] = useSearchParam();

  const fetchDocuments = async () => {
    try {

      // Tạo URL với query parameter search
      const params = new URLSearchParams();
      if (search && search.trim() !== "") {
        params.append("search", search);
      }

      const url = `/api/db/document${params.toString() ? `?${params.toString()}` : ""}`;

      // Lấy documents của user
      const docsRes = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!docsRes.ok) {
        console.error("Failed to fetch documents");
        return;
      }
      const data = await docsRes.json();
      setDocuments(data.allDocuments);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  useEffect(() => {
    // Fetch user info first, then fetch documents
    fetchDocuments();
  }, [search]); // Thêm search vào dependency để refetch khi search thay đổi


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