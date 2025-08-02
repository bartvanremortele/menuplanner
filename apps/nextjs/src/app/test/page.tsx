export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-blue-600">Test Tailwind v4</h1>
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-700">If you can see this styled, Tailwind is working.</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-red-500 text-white p-4 rounded">Red</div>
        <div className="bg-green-500 text-white p-4 rounded">Green</div>
        <div className="bg-blue-500 text-white p-4 rounded">Blue</div>
      </div>
    </div>
  );
}