'use client';

import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/lib/graphql-queries';

export default function TestPage() {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ direction: 'rtl', padding: '20px' }}>
      <h1>تست محصولات</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}