import RecipeOfTheDay from "@/components/RecipeOfTheDay/RecipeOfTheDay";

const page = () => {
  return (
    <div className="w-full">
      <RecipeOfTheDay />
    </div>
  );
};

export const dynamic = "force-dynamic";
export default page;
