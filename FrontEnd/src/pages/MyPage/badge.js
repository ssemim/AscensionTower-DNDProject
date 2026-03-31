const badges = [
  { id: 1, name: "뱃지1", imgUrl: "/images/badge/badge1.png", desc: "뱃지 1 설명" },
  { id: 2, name: "뱃지2", imgUrl: "/images/badge/badge2.png", desc: "뱃지 2 설명" },
  { id: 3, name: "뱃지3", imgUrl: "/images/badge/badge3.png", desc: "뱃지 3 설명" },
  { id: 4, name: "뱃지4", imgUrl: "/images/badge/badge4.png", desc: "뱃지 4 설명" },
  { id: 5, name: "뱃지5", imgUrl: "/images/badge/badge5.png", desc: "뱃지 5 설명" },
  { id: 6, name: "뱃지6", imgUrl: "/images/badge/badge6.png", desc: "뱃지 6 설명" },
  // 나머지 14개 슬롯을 위한 빈 데이터
  ...Array.from({ length: 14 }, (_, i) => ({ id: i + 7, isEmpty: true }))
];

export default badges;
