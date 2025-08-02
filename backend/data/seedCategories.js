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
        image: "https://example.com/audio.jpg",
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
  },
  {
    name: "Fashion",
    image: "https://example.com/fashion.jpg",
    subcategories: [
      {
        name: "Men",
        image: "https://example.com/men.jpg",
        subcategories: [
          {
            name: "Shirts",
            subcategories: [
              { name: "Formal Shirts" },
              { name: "Casual Shirts" }
            ]
          },
          {
            name: "Trousers",
            subcategories: [
              { name: "Chinos" },
              { name: "Jeans" }
            ]
          }
        ]
      },
      {
        name: "Women",
        image: "https://example.com/women.jpg",
        subcategories: [
          {
            name: "Dresses",
            subcategories: [
              { name: "Evening Gowns" },
              { name: "Summer Dresses" }
            ]
          },
          {
            name: "Sarees",
            subcategories: [
              { name: "Silk Sarees" },
              { name: "Cotton Sarees" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Home & Kitchen",
    image: "https://example.com/home.jpg",
    subcategories: [
      {
        name: "Furniture",
        subcategories: [
          { name: "Sofas" },
          { name: "Beds" },
          { name: "Dining Tables" }
        ]
      },
      {
        name: "Kitchen Appliances",
        subcategories: [
          { name: "Microwave Ovens" },
          { name: "Mixers" },
          { name: "Refrigerators" }
        ]
      }
    ]
  },
  {
    name: "Sports & Outdoors",
    image: "https://example.com/sports.jpg",
    subcategories: [
      {
        name: "Fitness",
        subcategories: [
          { name: "Treadmills" },
          { name: "Dumbbells" },
          { name: "Yoga Mats" }
        ]
      },
      {
        name: "Outdoor Sports",
        subcategories: [
          { name: "Cricket" },
          { name: "Football" },
          { name: "Badminton" }
        ]
      }
    ]
  }
];
