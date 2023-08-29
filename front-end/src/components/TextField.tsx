import { useField, useFormikContext } from "formik";

type props = {
  label: string;
  name: string;
  type?: string;
};

export const TextField = ({ label, name, type }: props) => {
  const { submitCount, handleChange } = useFormikContext();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_field, meta] = useField(name);
  const { error } = meta;
  return (
    <div className="mb-8 ">
      <p className="pl-1">{label}</p>
      <input
        type={type ? type : "text"}
        name={name}
        className="drop-shadow-xl bg-cyan-950 text-white border w-60 h-8 px-2 rounded-md"
        onChange={handleChange}
      />
      {error !== undefined && submitCount > 0 && (
        <p className="text-red-700 text-xs pl-1">{error}</p>
      )}
    </div>
  );
};
