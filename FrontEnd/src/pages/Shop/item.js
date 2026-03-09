const items = [
  { id: 1, name: "아이템1",price: "12,500", desc: "아이템설명1", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  { id: 2, name: "아이템2",price: "8,200", desc: "아이템설명2", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  { id: 3, name: "아이템3",  price: "1,500", desc: "아이템설명3", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  { id: 4, name: "아이템4", price: "12,500", desc: "아이템설명4", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  { id: 5, name: "아이템5", price: "8,200", desc: "아이템설명5", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  { id: 6, name: "아이템6", price: "1,500", desc: "아이템설명6", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  // 나머지 14개 슬롯을 위한 빈 데이터
  ...Array.from({ length: 14 }, (_, i) => ({ id: i + 7, isEmpty: true }))
];

export default items;
