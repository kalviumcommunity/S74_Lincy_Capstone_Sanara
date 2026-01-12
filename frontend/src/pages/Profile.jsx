import Navbar from "../components/Navbar";

export default function Profile() {
  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl">
        <h1 className="text-xl font-semibold">Your Profile</h1>
        <p className="mt-2 text-gray-600">
          Email is managed securely.
        </p>
      </div>
    </>
  );
}
