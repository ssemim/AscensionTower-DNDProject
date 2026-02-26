const items = [
  { id: 1, name: "아이템1",price: "12,500", desc: "Experimental energy edge utilizing concentrated arc particles." },
  { id: 2, name: "아이템2",price: "8,200", desc: "Multi-layered kinetic barrier with automatic ion-refresh." },
  { id: 3, name: "아이템3",  price: "1,500", desc: "Standard Stark-grade power cell for industrial use." },
  { id: 4, name: "아이템4", price: "12,500", desc: "Experimental energy edge utilizing concentrated arc particles." },
  { id: 5, name: "아이템5", price: "8,200", desc: "Multi-layered kinetic barrier with automatic ion-refresh." },
  { id: 6, name: "아이템6", price: "1,500", desc: "Standard Stark-grade power cell for industrial use." },
  // 나머지 14개 슬롯을 위한 빈 데이터
  ...Array.from({ length: 14 }, (_, i) => ({ id: i + 7, isEmpty: true }))
];

export default items;
