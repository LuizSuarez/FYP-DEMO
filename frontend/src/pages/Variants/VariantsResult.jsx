// src/pages/Variants/VariantResults.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { getMutationDensity, getRegionMetrics } from "../../services/variantService";

export default function VariantResults() {
  const { fileId } = useParams();
  const { token } = useAuth();
  const [density, setDensity] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching variant results...");
        const d = await getMutationDensity(fileId, token);
        console.log("Mutation density results:", d, token);
        setDensity(d);

        const m = await getRegionMetrics(fileId, token);
        console.log("Region metrics results:", m, token);
        setMetrics(m);
      } catch (err) {
        console.error("Error fetching variant results:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [fileId]);

  if (loading) return <p className="p-6 text-center text-gray-600">Loading results…</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Variant Analysis Result</h1>
      {variateVarible && (
        <div>
          <h2 className="text-xl font-semibold">Variant Analysis Overview</h2>
          <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(variantVarible, null, 2)}</pre>
        </div>
      )

      }
      {density && (
        <div>
          <h2 className="text-xl font-semibold">Mutation Density</h2>
          <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(density, null, 2)}</pre>
        </div>
      )}

      {metrics && (
        <div>
          <h2 className="text-xl font-semibold">Region Metrics</h2>
          <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(metrics, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
