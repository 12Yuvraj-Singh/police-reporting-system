export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full border p-3 rounded-xl focus:outline-blue-500 ${className}`}
      {...props}
    />
  );
}
    