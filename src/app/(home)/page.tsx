"use client";
import Link from "next/link";
import { Navbar } from "./navbar";
import { TemplatesGallery } from "./templates-gallery";
import api from "@/lib/axios";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  useDocuments,
  useDocument,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
} from "@/hooks/useDocuments";

const Home = () => {
  // useEffect(() => {
  //   const fetchDocuments = async () => {
  //     try {
  //       const res = await api.get("/documents/", { withCredentials: true });
  //       console.log(res.data.ds);
  //     } catch (error) {
  //       console.error("Error fetching documents:", error);
  //     }
  //   };

  //   fetchDocuments();
  // });

  const { data: documents, isLoading } = useDocuments();
  console.log(isLoading);
  return (
    <div className="min-h-screen flex flex-col"
    >
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <Navbar />
      </div>
      <div className="mt-16">
        <TemplatesGallery />

        <ul>
          {documents?.map((doc: any) => (
            <li key={doc.id}>
              {doc.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;