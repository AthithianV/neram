import NeramLogo from "@/assets/logo.png";

const Brand = () => {
  return (
    <div className="text-lg font-semibold flex gap-2 items-center justify-center">
      <img src={NeramLogo} alt="Neram Logo" className="h-6 w-6 rounded-md" />
      <h1 className="text-base">Neram</h1>
    </div>
  );
};

export default Brand;
