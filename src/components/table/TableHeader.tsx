export default function TableHeader() {
    return (
        <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-medium">
            <tr>
                <th className="px-6 py-4 text-left">Company / Role</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-right">Actions</th>
            </tr>
        </thead>
    );
}
