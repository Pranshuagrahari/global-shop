import DashboardLayout from "../layouts/DashboardLayout";
import AddProductForm from "../components/forms/AddProductForm";

const AddProduct = () => {
    return (
        <DashboardLayout title="Add Product">
            <AddProductForm />
        </DashboardLayout>
    );
};

export default AddProduct;