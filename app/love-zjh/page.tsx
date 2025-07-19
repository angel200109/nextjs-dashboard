export default function LoveConfessionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-red-200 to-yellow-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white bg-opacity-80 rounded-3xl shadow-2xl backdrop-blur-lg p-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-600 mb-6 animate-pulse">
          致我最爱的你 ❤️
        </h1>
        <p className="text-lg md:text-xl text-gray-800 leading-relaxed mb-8">
          遇见你，是我人生中最幸运的事。每一次的相处，每一次的笑容，
          都让我无比珍惜。
          <br />
          想对你说的话太多，却又不知从何说起。
          <br />
          只想让你知道，我的心里，已经装满了你。
        </p>

        <div className="relative w-full h-72 md:h-96 mb-10">
          <div className="absolute inset-0 border-4 border-pink-300 rounded-xl"></div>
          <p className="absolute inset-0 flex items-center justify-center text-pink-400 text-sm">
            <img src="/myd.jpg" alt="" />
          </p>
        </div>

        <p className="text-xl text-pink-700 font-semibold">
          愿往后余生，你是我的心动，也是我的归宿 💕
        </p>
      </div>
    </div>
  );
}
