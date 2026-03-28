const items = [
  { id: 1, name: "아이템1",price: "1250", desc: "아이템설명1", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  { id: 2, name: "아이템2",price: "820", desc: "아이템설명2", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  { id: 3, name: "아이템3",  price: "150", desc: "아이템설명3", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  { id: 4, name: "아이템4", price: "1250", desc: "아이템설명4", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  { id: 5, name: "아이템5", price: "820", desc: "아이템설명5", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  { id: 6, name: "아이템6", price: "150", desc: "아이템설명6", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  { id: 7, name: "아이템7",  price: "150", desc: "아이템설명3", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  { id: 8, name: "아이템8", price: "1250", desc: "아이템설명4", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  { id: 9, name: "아이템9", price: "820", desc: "아이템설명5", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  { id: 10, name: "아이템10", price: "150", desc: "아이템설명6", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  { id: 11, name: "아이템11", price: "150", desc: "아이템설명7", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  { id: 12, name: "아이템12", price: "150", desc: "아이템설명8", src: new URL("../../assets/items/hambuger.png", import.meta.url).href },
  // 나머지 8개 슬롯을 위한 빈 데이터
  ...Array.from({ length: 8 }, (_, i) => ({ id: i + 13, isEmpty: true }))
];

export default items;
