export type Program = {
  id: string;
  name: string;
  color: string;
  tagline: string;
  body: string;
  stats: { num: string; label: string }[];
  initiatives: string[];
  fullDescription: string[];
};

export const PROGRAMS: Program[] = [
  {
    id: "health",
    name: "Health & Wellness",
    color: "#8E191D",
    tagline: "Low-cost, high-quality care — delivered by volunteers who live in your community.",
    body: "Free health fairs, awareness lectures, preventative screenings, blood drives, bone marrow drives, and mobile clinics — delivered by volunteer physicians, nurses, and allied health professionals at BAPS centers across North America, Africa, and beyond.",
    stats: [
      { num: "11", label: "Countries served" },
      { num: "200+", label: "Center locations" },
      { num: "100%", label: "Volunteer-driven" },
    ],
    initiatives: [
      "Health Fairs",
      "Health Awareness Lectures",
      "Health Screenings",
      "Preventative & Chronic Care",
      "Free Clinics",
      "Mobile Medical Clinics",
      "Children's Health & Safety Day",
      "Hospitals & Clinics Support",
    ],
    fullDescription: [
      "BAPS Charities Health & Wellness programs bring comprehensive, low-cost healthcare directly to communities in need across North America, Africa, the United Kingdom, and beyond. At each event, licensed volunteer physicians, nurses, and allied health professionals provide screenings, consultations, and health education — all at no cost to participants.",
      "Health fairs and awareness lectures span dozens of cities each year, addressing topics from cardiovascular health and sleep medicine to pediatric care and chronic disease management. In 2026, lecture series on sleep and heart health have reached cities from San Diego, California to Cambridge, Ontario, with volunteer specialists emphasizing that 'sleep is equally important as diet and exercise.'",
      "Free clinics and mobile medical units extend care into underserved areas where access to qualified healthcare professionals is limited. Children's Health & Safety Days bring age-appropriate wellness education directly to families, equipping parents and children with the knowledge to make healthier choices.",
      "The organization's global network — spanning 11 countries and over 200 center locations — means that wherever a health crisis or need arises, BAPS volunteers are already present in that community. This proximity enables rapid, trusted, and culturally sensitive service delivery that external organizations cannot replicate.",
    ],
  },
  {
    id: "education",
    name: "Education",
    color: "#CF3728",
    tagline: "Education is the primary driver of development and progress in the world.",
    body: "Scholarships, career fairs, day schools, residential schools, educational hostels, and training programs — preparing students in communities across Asia, Africa, and North America for the opportunities available to them.",
    stats: [
      { num: "12", label: "Countries with programs" },
      { num: "6", label: "Program categories" },
      { num: "200+", label: "Centers worldwide" },
    ],
    initiatives: [
      "Merit Scholarships",
      "Career Fairs",
      "Educational Institutions Support",
      "Day Schools",
      "Residential Schools",
      "Educational Hostels",
      "Schools & Colleges Support",
      "Community Training Programs",
    ],
    fullDescription: [
      "BAPS Charities views education as the primary catalyst for development and progress. The organization's educational programs reach students across Asia, Africa, and North America — offering not only academic support but the values and character that make education truly transformative.",
      "The scholarship program provides merit-based financial support to high-achieving students who might otherwise be unable to access higher education. Career fairs connect students with professional mentors from medicine, engineering, law, business, and public service — helping them navigate complex academic and career pathways.",
      "In Asia and Africa, BAPS Charities operates day schools, residential schools, and educational hostels that serve students in some of the most underserved communities on earth. These institutions provide not merely instruction but a safe, nurturing environment for students whose families may lack educational resources at home.",
      "Training programs prepare young people for the opportunities available to them in their local economies, teaching practical skills alongside the ethical grounding that BAPS believes must accompany all education. Community learning extends across all 200+ center locations worldwide.",
    ],
  },
  {
    id: "environment",
    name: "Environment",
    color: "#4f7a3a",
    tagline: "Good stewards of the planet — through awareness, action, and community.",
    body: "Tree planting campaigns, Earth Day initiatives, World Environment Day programs, and community cleanups — turning environmental stewardship into a global community practice across 12 countries.",
    stats: [
      { num: "2,000", label: "Trees planted at Kinale Forest, Kenya (Earth Day 2026)" },
      { num: "12", label: "Countries with programs" },
      { num: "Annual", label: "Earth Day & World Environment Day events" },
    ],
    initiatives: [
      "Earth Day Programs",
      "Tree Planting Campaigns",
      "World Environment Day Events",
      "Community Cleanups",
      "Reforestation Drives",
      "Environmental Awareness Initiatives",
    ],
    fullDescription: [
      "BAPS Charities functions as good stewards of the planet, mobilizing volunteers across 12 countries to protect and restore natural environments through awareness campaigns, community action, and reforestation drives. The belief that nature is sacred — and must be actively cared for — drives a year-round calendar of environmental service.",
      "Tree planting campaigns have brought thousands of volunteers together at forests, parks, and community spaces to restore forest cover and support local ecosystems. On Earth Day 2026, BAPS Charities partnered with KENVO (Kenya Environmental Volunteers Organization) to plant 2,000 trees at Kinale Forest in Kiambu County, Kenya — engaging volunteers across all age groups in planting and nurturing young trees to support biodiversity and strengthen natural habitats.",
      "Earth Day and World Environment Day programs combine public awareness with direct action. Participants are invited not only to attend events but to adopt lasting green habits — reducing waste, conserving water, and becoming advocates for sustainability in their own households and communities.",
      "Community cleanup initiatives mobilize hundreds of volunteers at a time to restore parks, roadsides, and public spaces. These events demonstrate that environmental care is not a distant policy issue but a personal, communal responsibility — one that every BAPS volunteer takes seriously.",
    ],
  },
  {
    id: "humanitarian",
    name: "Humanitarian Relief",
    color: "#c08a2c",
    tagline: "In times of natural and manmade calamity, we respond effectively to the needs of the hour.",
    body: "Rapid disaster response from hurricanes and wildfires to global pandemics — BAPS Charities volunteers mobilize in the communities where they live to provide relief, support, and rehabilitation when it matters most.",
    stats: [
      { num: "2025", label: "LA Wildfire relief response" },
      { num: "2024", label: "Hurricane Helene & Milton response" },
      { num: "2001–now", label: "Continuous disaster relief since Kutch earthquake" },
    ],
    initiatives: [
      "Disaster Relief Fund",
      "Wildfire Relief & Recovery",
      "Hurricane Response",
      "Pandemic Relief",
      "Winter Blanket Drives",
      "Essential Kit Drives",
      "VIC Bushfire Relief (Australia)",
      "Refugee & Community Support",
    ],
    fullDescription: [
      "In times of disaster, BAPS Charities volunteers mobilize in the communities where they live to provide relief, support, and rehabilitation. From the 2001 earthquake in Kutch, India to Hurricane Katrina in the United States, the organization has answered natural and manmade calamities with speed, compassion, and scale.",
      "Recent responses include the Los Angeles Wildfire Relief and Recovery effort following the 2025 Southern California fires — where multiple blazes across the LA area devastated communities, leaving thousands of families without homes, power, or access to basic necessities. The BAPS volunteer network was already present in affected communities and mobilized immediately to provide support.",
      "In 2024, Hurricane Helene and Milton devastated communities across the southeastern United States, leaving thousands of families without shelter or essential services. BAPS Charities coordinated relief across multiple states, delivering supplies and direct community support through its extensive volunteer infrastructure.",
      "Australia has seen BAPS Charities respond to the Victorian Bushfire crisis, while Canada and New Zealand have received support during pandemic-era hardships through organized relief funds. Winter blanket drives and essential kit drives operate alongside these emergency responses, addressing chronic vulnerability between disasters.",
    ],
  },
  {
    id: "community",
    name: "Community Empowerment",
    color: "#4a6b7a",
    tagline: "The power to build better communities lies in the hands of the very members of those communities.",
    body: "Annual walkathons, sports events, food drives, children's fun days, community cleanups, and seasonal programs — building the social fabric that connects families across North America, Africa, and beyond.",
    stats: [
      { num: "12", label: "Countries with programs" },
      { num: "200+", label: "Center locations" },
      { num: "100+", label: "Cities hosting Walk | Run events" },
    ],
    initiatives: [
      "In the Joy of Others: Walk | Run",
      "Annual Challenge 10K Walk / 30K Cycle",
      "Children's Fun Day",
      "Community Cleanup",
      "Community Sporting Events",
      "Orphanage & School Support",
      "Walkathons",
      "Winter Warmer",
      "Clothes Recycling",
      "Mandela Day",
    ],
    fullDescription: [
      "BAPS Charities Community Empowerment programs are grounded in a simple belief: the power to build better communities lies in the hands of the very members of those communities. By organizing walkathons, sporting events, children's days, and seasonal drives, BAPS volunteers become the connective tissue of their neighborhoods.",
      "The flagship 'In the Joy of Others: Walk | Run' series is BAPS Charities' largest annual fundraiser, drawing participants across more than 100 cities in the United States, Canada, Australia, and beyond. The 2026 series spans cities from coast to coast and across Australia, bringing thousands of participants together in a shared expression of service and solidarity.",
      "Community sporting events — including challenge walks, cycle rides, and youth volleyball tournaments — provide inclusive spaces where families connect across generations. The 2026 Women's Youth Volleyball Tournament in Toronto brought approximately 100 participants from across Southern Ontario together in a spirit of healthy competition and community pride.",
      "Seasonal programs like Winter Warmers, clothes recycling drives, and children's fun days address practical needs while building lasting community bonds. Orphanage and school support programs extend BAPS Charities' community commitment globally, with volunteers in Kenya, Uganda, Tanzania, and South Africa providing resources and mentorship to children in vulnerable circumstances.",
    ],
  },
  {
    id: "blood-drives",
    name: "Blood & Bone Marrow Drives",
    color: "#8E191D",
    tagline: "Every minute of every day, someone needs blood to survive.",
    body: "BAPS Charities has long answered the urgent and continuing need for blood by organizing donation drives for communities throughout the world — from North America to Nairobi — partnering with hospitals and blood banks to save lives.",
    stats: [
      { num: "Global", label: "Drives across 12 countries" },
      { num: "2025", label: "Nairobi Blood Drive — June 2025" },
      { num: "100%", label: "Volunteer-organized" },
    ],
    initiatives: [
      "Blood Donation Events",
      "Bone Marrow Drives",
      "Hospital & Blood Bank Partnerships",
      "Community Awareness Campaigns",
      "Emergency Blood Responses",
      "Youth Donor Outreach",
    ],
    fullDescription: [
      "Whether it's routine surgery, an accident, or disaster, every minute of every day someone needs blood to survive. BAPS Charities has long been actively answering this urgent and continuing need by organizing blood donation drives for the benefit of communities throughout the world — from centers across North America to events in Nairobi, Kenya.",
      "Blood drives are organized through partnerships with local hospitals, blood banks, and health authorities, ensuring that every unit donated is efficiently directed to patients who need it most. The June 2025 Nairobi Blood Drive is among the most recent examples of BAPS Charities' global reach in health service.",
      "Bone marrow registration drives expand the pool of potential donors for patients battling leukemia, lymphoma, and other blood cancers. Every registration represents a future gift of life — and BAPS Charities works to reduce barriers to registration in communities that are historically underrepresented in donor registries.",
      "All drives are organized and staffed entirely by volunteers. No compensation is exchanged — every participant, from the organizing committee to the on-site coordinators, donates their time alongside their blood. This ethos of selfless service is the foundation of every BAPS Charities health program.",
    ],
  },
  {
    id: "food-drives",
    name: "Food Drives",
    color: "#4C4238",
    tagline: "No family should go hungry — especially during the holidays.",
    body: "Across the United States, Canada, and beyond, BAPS Charities volunteers collect and distribute hundreds of thousands of pounds of food annually to local food banks, pantries, and families facing food insecurity.",
    stats: [
      { num: "662,000+", label: "Pounds donated to Canadian food banks" },
      { num: "100+", label: "US & Canada cities participating" },
      { num: "Annual", label: "Holiday season drives" },
    ],
    initiatives: [
      "Holiday Food Drives",
      "Year-Round Collection Drives",
      "Food Bank Partnerships",
      "Non-Perishable Food Collections",
      "Community Pantry Support",
      "Essential Kit Drives",
    ],
    fullDescription: [
      "Food insecurity remains a pressing issue across North America, particularly during the holiday season when demand at food banks surges and costs for food, housing, and transportation push more families to the edge. BAPS Charities volunteers step in to fill the gap — collecting, sorting, and delivering non-perishable food items to families in need across more than 100 cities in the United States and Canada.",
      "The scale of this work is significant: BAPS Charities has donated over 662,000 pounds — 33.1 tons — of food to food banks across Canada. Every drive is an act of direct community care, connecting BAPS center members with their neighbors in the most practical expression of service.",
      "Individual drives contribute meaningfully at the local level. In Cambridge, Ontario alone, BAPS volunteers collected over 390 pounds of non-perishable food items in December 2024, donating them to the Cambridge Food Bank — critical support for children, single parents, and seniors struggling with rising costs.",
      "Beyond North America, BAPS Charities' global network supports food security through orphanage support, community feeding programs, and essential kit drives in Africa, the United Kingdom, Australia, and other countries. The commitment to ensuring no family goes hungry is a thread woven through every program BAPS Charities runs.",
    ],
  },
  {
    id: "career-education",
    name: "Career & Scholarship Programs",
    color: "#CF3728",
    tagline: "Investing in the next generation of leaders and professionals.",
    body: "BAPS Charities provides merit-based scholarships, career fairs, and educational institution support to help bright students access higher education and professional opportunities — particularly those who are first in their families to attend university.",
    stats: [
      { num: "Scholarships", label: "Awarded annually to qualifying students" },
      { num: "Career Fairs", label: "Connecting students with professional mentors" },
      { num: "Global", label: "Educational institutions supported" },
    ],
    initiatives: [
      "Merit Scholarships",
      "Career Fairs",
      "Educational Institutions Support",
      "First-Generation College Support",
      "Graduate Program Grants",
      "Professional Mentorship",
    ],
    fullDescription: [
      "BAPS Charities Merit Scholarship programs award financial support to high-achieving students who demonstrate both academic excellence and a commitment to service. Scholarships are distributed annually through a competitive process, with priority given to students who face financial barriers to accessing higher education.",
      "Career fairs connect students with professional mentors from medicine, engineering, law, technology, and public service. Volunteer professionals donate hours to advise the next generation on navigating complex career and academic landscapes — offering the kind of personal guidance that many first-generation college students have historically lacked.",
      "Educational institution support extends BAPS Charities' investment beyond individual scholarships. Day schools, residential schools, and educational hostels in Asia and Africa provide structured learning environments for students in underserved communities — addressing educational inequality at a systemic level.",
      "Across all programs, BAPS Charities emphasizes that education must encompass both academic excellence and ethical grounding. The organization's educational philosophy — rooted in the BAPS tradition of character alongside competence — ensures that every student supported becomes not only more capable, but more committed to serving others.",
    ],
  },
];

export function getProgramById(id: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}
