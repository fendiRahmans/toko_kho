import React from 'react'

const Products: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Produk Kami</h1>
      <p className="text-gray-600">Jelajahi koleksi produk kami yang lengkap.</p>
      {/* Placeholder untuk daftar produk */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="border p-4 rounded">
          <h3 className="font-semibold">Produk 1</h3>
          <p>Deskripsi produk 1</p>
        </div>
        <div className="border p-4 rounded">
          <h3 className="font-semibold">Produk 2</h3>
          <p>Deskripsi produk 2</p>
        </div>
        <div className="border p-4 rounded">
          <h3 className="font-semibold">Produk 3</h3>
          <p>Deskripsi produk 3</p>
        </div>
      </div>
    </div>
  )
}

export default Products