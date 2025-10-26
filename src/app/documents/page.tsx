
import { db } from '@/db';
import { users } from '@/db/schema';

// ✅ Infer User type from schema
type User = typeof users.$inferSelect;

const DocumentsPage = async () => {
    const allUsers = await db.select().from(users);

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {allUsers.map((user: User) => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default DocumentsPage