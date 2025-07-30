export const categoriesData = [
  {
    name: "Electronics",
    image: "https://example.com/electronics.jpg",
    subcategories: [
      {
        name: "Cameras",
        image: "https://example.com/cameras.jpg",
        subcategories: [
          {
            name: "Cinema Cameras",
            image: "https://example.com/cinema.jpg",
            subcategories: [
              {
                name: "RED Komodo 6K",
                image: "https://example.com/redkomodo.jpg",
              },
              {
                name: "Blackmagic Pocket 6K",
                image: "https://example.com/blackmagic.jpg",
              }
            ]
          },
          {
            name: "DSLRs",
            subcategories: [
              { name: "Canon EOS 1500D" },
              { name: "Nikon D5600" }
            ]
          }
        ]
      },
      {
        name: "Audio",
        subcategories: [
          {
            name: "Headphones",
            subcategories: [
              { name: "Sony WH-1000XM4" },
              { name: "Bose QC45" }
            ]
          }
        ]
      },
      {
        name: "Lighting",
        subcategories: [
          { name: "Studio Lights" },
          { name: "Ring Lights" }
        ]
      }
    ]
  }
];
