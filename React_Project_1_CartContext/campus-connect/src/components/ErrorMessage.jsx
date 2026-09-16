export default function ErrorMessage({ message }) {
  return (
    <div className="error-box">
      <span>⚠️</span>
      <p>{message || "Something went wrong. Please try again."}</p>
    </div>
  );
}
