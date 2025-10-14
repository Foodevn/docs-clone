
import { db } from '@/db';
import { users } from '@/db/schema';
import { useEffect, useState } from 'react';

const DocumentsPage = async () => {
    const allUsers = await db.select().from(users);

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {allUsers.map((user: any) => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default DocumentsPage