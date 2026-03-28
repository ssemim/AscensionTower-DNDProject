const badges = [
  { id: 1, name: "뱃지1", imgUrl: "/images/badge/badge1.png", desc: "Experimental energy edge utilizing concentrated arc particles." },
  { id: 2, name: "뱃지2", imgUrl: "/images/badge/badge2.png", desc: "Multi-layered kinetic barrier with automatic ion-refresh." },
  { id: 3, name: "뱃지3", imgUrl: "/images/badge/badge3.png", desc: "Standard Stark-grade power cell for industrial use." },
  { id: 4, name: "뱃지4", imgUrl: "/images/badge/badge4.png", desc: "Experimental energy edge utilizing concentrated arc particles." },
  { id: 5, name: "뱃지5", imgUrl: "/images/badge/badge5.png", desc: "Multi-layered kinetic barrier with automatic ion-refresh." },
  { id: 6, name: "뱃지6", imgUrl: "/images/badge/badge6.png", desc: "Standard Stark-grade power cell for industrial use." },
  // 나머지 14개 슬롯을 위한 빈 데이터
  ...Array.from({ length: 14 }, (_, i) => ({ id: i + 7, isEmpty: true }))
];

export default badges;
