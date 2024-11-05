import { getProductById } from "@/lib/actions/product.actions";

type Props = {
  params: {
    id: string;
  };
};

export default async function EditProduct({ params }: Props) {
  const { id } = params;
  const product = await getProductById(id);

  if (!product.data || product.errors) {
    throw new Error("An error has occured");
  }

  if (!product.data.id) {
    return (
      <div className="p-8 max-w-md space-y-2">
        <h1 className="text-2xl">No User Found for that ID.</h1>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-md space-y-2">
      <h1 className="text-2xl"></h1>
      {product.data.name}
    </div>
  );
}
