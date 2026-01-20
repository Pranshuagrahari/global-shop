import DashboardLayout from "../layouts/DashboardLayout";
import AllProductPage from "../components/pages/AllProductPage.tsx";

const AddProduct = () => {
    return (
        <DashboardLayout title="Products">
            <AllProductPage/>
        </DashboardLayout>
    );
};

export default AddProduct;