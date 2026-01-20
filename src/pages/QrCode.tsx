import DashboardLayout from "../layouts/DashboardLayout";
import QrCodesPage from "../components/pages/QrCodesPage.tsx";

const QrCodes = () => {
    return (
        <DashboardLayout title="QR Codes">
            <QrCodesPage/>
        </DashboardLayout>
    );
};

export default QrCodes;