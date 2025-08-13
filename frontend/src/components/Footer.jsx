export default function Footer() {
  return (
    <footer className="py-8 bg-[#121212] text-[#CCCCCC] border-t border-[#2a2a2a] oxanium-regular">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-sm justify-center text-center">
          <div>
            <h4 className="font-semibold text-white mb-2">
              Ivan Putra Pratmaa
            </h4>
            <p>
              Email:{" "}
              <a
                href="mailto:iivanpratama16@gmail.com"
                className="text-blue-400 hover:underline"
              >
                iivanpratama16@gmail.com
              </a>
            </p>
            <p>
              Telp:{" "}
              <a
                href="https://wa.me/6281326926776"
                className="text-blue-400 hover:underline"
              >
                +62 812-2692-6776
              </a>
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">
              Aditya Zola Sulistya Ramadhan
            </h4>
            <p>
              Email:{" "}
              <a
                href="mailto:adityazolaaa@gmail.com"
                className="text-blue-400 hover:underline"
              >
                adityazolaaa@gmail.com
              </a>
            </p>
            <p>
              Telp:{" "}
              <a
                href="https://wa.me/6289510724100"
                className="text-blue-400 hover:underline"
              >
                +62 895-1072-4100
              </a>
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">
              Naufal Naba'ul Choir
            </h4>
            <p>
              Email:{" "}
              <a
                href="mailto:khoirnaufal345@gmail.com"
                className="text-blue-400 hover:underline"
              >
                khoirnaufal345@gmail.com
              </a>
            </p>
            <p>
              Telp:{" "}
              <a
                href="https://wa.me/6282134097404"
                className="text-blue-400 hover:underline"
              >
                +62 821-3409-7404
              </a>
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">
              Yutase Jordan Amrullah
            </h4>
            <p>
              Email:{" "}
              <a
                href="mailto:yutasej@gmail.com"
                className="text-blue-400 hover:underline"
              >
                yutasej@gmail.com
              </a>
            </p>
            <p>
              Telp:{" "}
              <a
                href="https://wa.me/6281215987726"
                className="text-blue-400 hover:underline"
              >
                +62 812-1598-7726
              </a>
            </p>
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Kosuco. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
