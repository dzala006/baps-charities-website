// Real image URLs sourced from media.bapscharities.org
// Each entry: { url, caption, category }

export type GalleryImage = {
  url: string;
  caption: string;
  category: "Health" | "Environment" | "Food Drives" | "Community" | "Walk" | "Youth";
};

export const GALLERY_IMAGES: GalleryImage[] = [
  // Health Awareness
  {
    url: "https://media.bapscharities.org/2026/04/13034755/SanDiego-HAL-04122026-2.jpg",
    caption: "Health Lecture on Sleep & Heart Health — San Diego, CA",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2026/04/22214058/02.cambridge_hlecture2_2026-600x388.jpg",
    caption: "Health Lecture on Sleep & Heart Health — Cambridge, ON",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2026/04/16193538/01_-Regina_hlecture2-1-600x450.jpeg",
    caption: "Health Lecture on Sleep & Heart Health — Regina, SK",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2026/04/16183318/3_Edmonton_HAL_APR26-copy-600x450.jpg",
    caption: "Health Awareness Lecture — Edmonton, AB",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2026/04/13225915/06_-Toronto_hlecture2_2026_-1-600x441.jpg",
    caption: "Health Awareness Lecture — Toronto, ON",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2026/04/13211156/01_-Scarborough_hlecture2_2026_NHP_2504-600x400.jpg",
    caption: "Health Awareness Lecture — Scarborough, ON",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2026/03/18084415/01.-springfield_hlecture1_2026-600x390.jpg",
    caption: "Women's Health Lecture on Sleep Health — Springfield, MA",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2026/03/28135051/DSC_0076-600x400.jpeg",
    caption: "Women's Health Lecture on Sleep Health — St. Louis, MO",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2026/02/22182924/01.-cincinnati_hlecture1_2026-600x401.jpg",
    caption: "Women's Health Lecture on Sleep Health — Cincinnati, OH",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2026/03/01223800/01.Detroit_hlecture1_2026-600x400.jpg",
    caption: "Women's Health Lecture on Sleep Health — Detroit, MI",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2026/02/19133203/03sterlingheights_hlecture1_2026-600x400.jpg",
    caption: "Women's Health Lecture on Sleep Health — Sterling Heights, MI",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2026/03/10125424/01.-fresno_hlecture1_2026-600x400.jpg",
    caption: "Women's Health Lecture on Sleep Health — Fresno, CA",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2026/02/23154929/11_Robbinsville_hlecture1_2026-1-600x400.jpg",
    caption: "Women's Health Lecture on Sleep Health — Robbinsville, NJ",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2026/03/09203907/03.-Boston_hlecture1_2026-600x362.jpg",
    caption: "Women's Health Lecture on Sleep Health — Boston, MA",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2026/03/04102514/03.-Seattle_hlecture1_2026_cr-600x400.jpg",
    caption: "Women's Health Lecture on Sleep Health — Seattle, WA",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2025/07/20234635/02-HealthL2025-1620x1080.jpg",
    caption: "Health Awareness Lectures — 2025 Series",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2025/06/01165629/01_Lilburn_anxiety_hlecture_2025-1620x1080.jpeg",
    caption: "Health Awareness Lecture on Anxiety — Lilburn, GA",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2025/06/19122832/51_Healthcare-Professionals-Conference-2025-1-1280x720.jpg",
    caption: "Inaugural BAPS Charities Healthcare Professionals Conference — 2025",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2025/05/19181802/2.-Saskatoon_anxiety_hlecture_2025-1620x1080.jpg",
    caption: "Health Awareness Lectures on Anxiety — Saskatoon, SK",
    category: "Health",
  },
  {
    url: "https://media.bapscharities.org/2023/03/04113144/1_BAPS_Charities_Seattle_WA_King_County_Support_15FEB2023-877x720.jpg",
    caption: "Community Health Support — Seattle, WA (King County Partnership)",
    category: "Health",
  },
  // Environment & Earth Day
  {
    url: "https://media.bapscharities.org/2026/04/23145355/NairobiKenya_Kinale_Tree_Planting_04_2026_11-600x400.jpg",
    caption: "Earth Day Tree Planting at Kinale Forest — Nairobi, Kenya",
    category: "Environment",
  },
  // Community & Special Needs
  {
    url: "https://media.bapscharities.org/2026/04/27063254/NairobiKenya_Talk_InvisibleTruth_04_2026_12-600x400.jpg",
    caption: "Special Needs Awareness Talk — Nairobi, Kenya",
    category: "Community",
  },
  // Food Drives
  {
    url: "https://media.bapscharities.org/2025/12/30193436/00_BAPS-Charities-Food-Bank-2025.jpg",
    caption: "BAPS Charities Donates 662,000+ Pounds of Food to Food Banks Across Canada",
    category: "Food Drives",
  },
  {
    url: "https://media.bapscharities.org/2025/12/29235605/00b_Canadawide_Fooddrive_2.jpg",
    caption: "Canada-Wide Food Drive 2025",
    category: "Food Drives",
  },
  {
    url: "https://media.bapscharities.org/2025/12/29235604/00a_Canadawide_Fooddrive_1.jpg",
    caption: "Canada-Wide Food Drive 2025 — Volunteers Loading Food Bank Donations",
    category: "Food Drives",
  },
  {
    url: "https://media.bapscharities.org/2025/12/29235647/09_Canadawide_Fooddrive_Brampton_2025.jpg",
    caption: "Canada-Wide Food Drive — Brampton, ON",
    category: "Food Drives",
  },
  {
    url: "https://media.bapscharities.org/2025/01/01005423/02_Toronto_Food_Drive_2024_DBFB_02-1196x720.jpg",
    caption: "Food Drive at the Daily Bread Food Bank — Toronto, ON",
    category: "Food Drives",
  },
  // Walk / Run
  {
    url: "https://media.bapscharities.org/2026/01/23113836/Embrace-the-Spirit-of-Service-Walk-for-Your-Community.jpg",
    caption: "Join Us for Walk 2026 — Spirit of Service",
    category: "Walk",
  },
  {
    url: "https://media.bapscharities.org/2025/06/18113317/YT-Thumbnail-1.jpg",
    caption: "2026 Walk | Run — 15 Centres Across Canada",
    category: "Walk",
  },
  {
    url: "https://media.bapscharities.org/2023/07/23221910/ADL_Winter_Blanket_20230723_101154-1440x1080.jpg",
    caption: "Winter Blanket Donation Drive — ADL Partnership",
    category: "Community",
  },
  // Youth
  {
    url: "https://media.bapscharities.org/2025/06/16232636/24_Scarborough_AmrutCup2025__MGB1962-1559x1080.jpg",
    caption: "BAPS Charities Youth Sports Tournament — Amrut Cup, Scarborough, ON",
    category: "Youth",
  },
];

export const GALLERY_CATEGORIES = ["All", "Health", "Food Drives", "Environment", "Community", "Walk", "Youth"] as const;
export type GalleryCategory = typeof GALLERY_CATEGORIES[number];
