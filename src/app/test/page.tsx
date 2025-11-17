"use client";
import React from 'react'
import api from "@/lib/axios";
const pages = () => {

    const req = async () => {
        const response = await api.get("/documents");
        console.log(response.data.dsDocuments)
    }

    return (
        <>
            <div>test pages</div>
            <button
                onClick={req}
            >test</button>
        </>
    )
}
export default pages;