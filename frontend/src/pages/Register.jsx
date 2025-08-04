function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#bg-[#0F0F0F]] via-[#bg-[#0F0F0F]] to-[#8A2BE2]">
      <div className="bg-[#0e0e1f]/80 backdrop-blur-md shadow-2xl rounded-xl w-full max-w-md p-8 border border-purple-500">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#00FFFF] tracking-wide">
          Formulir Pendaftaran Anggota
        </h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white oxanium-regular">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              className="w-full mt-1 bg-black/40 border border-purple-500 rounded-lg px-4 py-2 text-white oxanium-regular placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white oxanium-regular">
              Email Aktif
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 bg-black/40 border border-purple-500 rounded-lg px-4 py-2 text-white oxanium-regular placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="contoh@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-white oxanium-regular">
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              id="whatsapp"
              className="w-full mt-1 bg-black/40 border border-purple-500 rounded-lg px-4 py-2 text-white oxanium-regular placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="08xxxxxxxxxx"
              required
            />
          </div>

          <div>
            <label htmlFor="interest" className="block text-sm font-medium text-white oxanium-regular">
              Minat/Ketertarikan
            </label>
            <select
              id="interest"
              className="w-full mt-1 bg-black/40 border border-purple-500 rounded-lg px-4 py-2 text-white oxanium-regular focus:outline-none focus:ring-2 focus:ring-pink-500"
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
            <label htmlFor="reason" className="block text-sm font-medium text-white oxanium-regular">
              Mengapa ingin bergabung?
            </label>
            <textarea
              id="reason"
              rows={4}
              className="w-full mt-1 bg-black/40 border border-purple-500 rounded-lg px-4 py-2 text-white oxanium-regular placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Tulis alasan kamu ingin bergabung..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white oxanium-regular font-bold py-2 rounded-lg transition duration-300 tracking-wide shadow-md"
          >
            Daftar Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
