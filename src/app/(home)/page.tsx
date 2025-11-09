"use client";

import { Navbar } from "./navbar";
import { TemplatesGallery } from "./templates-gallery";

import { DocumentsTable } from "./documents-table";

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


  return (
    <div className="min-h-screen flex flex-col"
    >
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <Navbar />
      </div>
      <div className="mt-16">
        <TemplatesGallery />
        <DocumentsTable />
      </div>
    </div>
  );
}

export default Home;