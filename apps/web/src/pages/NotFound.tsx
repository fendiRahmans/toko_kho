const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl p-8 shadow-lg">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-8">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-500 mb-8 text-center">
        Maaf, halaman yang Anda cari tidak dapat ditemukan.
      </p>
      <a
        href="/home"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Kembali ke Beranda
      </a>
    </div>
  )
}

export default NotFound