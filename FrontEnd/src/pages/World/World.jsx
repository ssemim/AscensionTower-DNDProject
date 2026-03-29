import ChronologySection from "./ChronologySection";
import mapImage from '../../assets/image/map.png';

export default function World(){

  return (
    <div>

          <div className="absolute inset-0 pointer-events-none bg-stark-grid opacity-20 dark:opacity-100"></div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            
       <section className="px-0 py-0 flex flex-col items-center text-center relative z-10 inset-0 bg-black bg-opacity-50">
          <img src={mapImage} alt="Map" className="w-3/4" />
        </section>

      <div className="w-full px-12 relative z-10">
        <hr className="border-t border-gray-500/30" />
      </div>

      <ChronologySection />

    </div>

  )
}
