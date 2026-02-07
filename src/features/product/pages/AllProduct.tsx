import DashboardLayout from "../../dashboard/layouts/DashboardLayout";
import AllProductPage from "../../../components/pages/AllProductPage";

const AllProduct = () => {
    return (
        <DashboardLayout title="Products">
            <AllProductPage />
        </DashboardLayout>
    );
};

export default AllProduct;