function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Formulir Pendaftaran Anggota
        </h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Aktif
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="contoh@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium">
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              id="whatsapp"
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="08xxxxxxxxxx"
              required
            />
          </div>

          <div>
            <label htmlFor="interest" className="block text-sm font-medium">
              Minat/Ketertarikan
            </label>
            <select
              id="interest"
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">-- Pilih Minat --</option>
              <option value="desain">Desain</option>
              <option value="programming">Programming</option>
              <option value="event">Event Organizer</option>
              <option value="sosial">Sosial & Komunitas</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium">
              Mengapa ingin bergabung?
            </label>
            <textarea
              id="reason"
              rows={4}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Tulis alasan kamu ingin bergabung..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Daftar Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
