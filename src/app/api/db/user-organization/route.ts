import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { organizations, userOrganizations } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

import { cookies } from 'next/headers';

