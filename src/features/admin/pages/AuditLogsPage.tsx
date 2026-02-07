import DashboardLayout from "../../dashboard/layouts/DashboardLayout";

const AuditLogsPage = () => {
    const logs = [
        { id: 1, action: "User Promotion", details: "Promoted user 'john_doe' to Seller", admin: "SuperAdmin", ip: "192.168.1.1", time: "2 mins ago", severity: "medium" },
        { id: 2, action: "Settings Change", details: "Updated Platform Fee to 12%", admin: "SuperAdmin", ip: "192.168.1.1", time: "1 hour ago", severity: "high" },
        { id: 3, action: "Login", details: "Admin login detected", admin: "SuperAdmin", ip: "192.168.1.1", time: "4 hours ago", severity: "low" },
    ];

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'medium': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        }
    };

    return (
        <DashboardLayout title="Risk & Audit Logs">
            <div className="p-8">
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">System Events</h2>
                        <button className="text-sm text-indigo-400 hover:text-indigo-300">Export CSV</button>
                    </div>
                    <div className="space-y-4">
                        {logs.map((log) => (
                            <div key={log.id} className="flex items-start justify-between p-4 bg-[#111] rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                                <div className="flex gap-4">
                                    <div className={`px-2 py-1 rounded text-xs border uppercase font-bold tracking-wider h-fit ${getSeverityColor(log.severity)}`}>
                                        {log.severity}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{log.action}</div>
                                        <div className="text-gray-500 text-sm mt-1">{log.details}</div>
                                        <div className="text-gray-600 text-xs mt-2 flex gap-3">
                                            <span>By: {log.admin}</span>
                                            <span>IP: {log.ip}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-gray-500 text-sm">{log.time}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AuditLogsPage;
