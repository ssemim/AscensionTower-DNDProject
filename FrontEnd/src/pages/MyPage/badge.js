const badges = [
  { id: 1, name: "뱃지1", desc: "Experimental energy edge utilizing concentrated arc particles." },
  { id: 2, name: "뱃지2", desc: "Multi-layered kinetic barrier with automatic ion-refresh." },
  { id: 3, name: "뱃지3",  desc: "Standard Stark-grade power cell for industrial use." },
  { id: 4, name: "뱃지4", desc: "Experimental energy edge utilizing concentrated arc particles." },
  { id: 5, name: "뱃지5", desc: "Multi-layered kinetic barrier with automatic ion-refresh." },
  { id: 6, name: "뱃지6", desc: "Standard Stark-grade power cell for industrial use." },
  // 나머지 14개 슬롯을 위한 빈 데이터
  ...Array.from({ length: 14 }, (_, i) => ({ id: i + 7, isEmpty: true }))
];

export default badges;
