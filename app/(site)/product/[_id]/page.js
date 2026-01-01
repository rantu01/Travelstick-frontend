"use client";
import ProductDetailsPage from "@/app/components/theme1/product/productDetails";
import { fetchPageContentTheme1 } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";

const ProjectDetails = () => {

  const [data] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data?.theme;


  return (
    <div>
      <ProductDetailsPage theme={theme} />
    </div>
  );
};

export default ProjectDetails;
