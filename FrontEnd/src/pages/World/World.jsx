import ChronologySection from "./ChronologySection";

export default function World(){
  const worldStyle = {
    backgroundImage: `url('https://cdn.pixabay.com/photo/2023/04/11/13/27/fantasy-79172 fantastical-scenery-of-a-mysterious-and-enchanting-world-g3169850f0_1280.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  return (
        <div 
          className="min-h-screen bg-main text-text-main font-mono overflow-x-hidden relative"
          style={worldStyle}
        >
          <div className="absolute inset-0 pointer-events-none bg-stark-grid opacity-20 dark:opacity-100"></div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            
       <section className="px-12 py-32 flex flex-col items-center text-center relative z-10">
          <div className="mb-4 flex items-center gap-2"></div>
        </section>

      <div className="w-full px-12 relative z-10">
        <hr className="border-t border-gray-500/30" />
      </div>

      <ChronologySection />

    </div>

  )
}
