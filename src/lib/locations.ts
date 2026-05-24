export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export const DISTRICTS_BY_STATE: Record<string, string[]> = {
  "Telangana": [
    "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
    "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
    "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar",
    "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool",
    "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli",
    "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet",
    "Vikarabad", "Wanaparthy", "Warangal", "Hanumakonda", "Yadadri Bhuvanagiri"
  ],
  "Andhra Pradesh": [
    "Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya",
    "Bapatla", "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari",
    "Eluru", "Guntur", "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR",
    "Palnadu", "Parvathipuram Manyam", "Prakasam", "SPSR Nellore",
    "Sri Sathya Sai", "Srikakulam", "Tirupati", "Visakhapatnam",
  ]
};

export const MANDALS_BY_DISTRICT: Record<string, string[]> = {
  "Hyderabad": [
    "Ameerpet", "Asifnagar", "Bahadurpura", "Charminar", "Golconda", 
    "Himayatnagar", "Khairatabad", "Marredpally", "Musheerabad", "Nampally", 
    "Saidabad", "Secunderabad", "Shaikpet", "Trimulgherry"
  ],
  "Ranga Reddy": [
    "Serilingampally", "Rajendranagar", "Saroornagar", "Hayathnagar", 
    "Shamshabad", "Ibrahimpatnam", "Maheshwaram", "Kondurg", "Chevella", 
    "Shabad", "Moinabad", "Gandipet"
  ],
  "Medchal-Malkajgiri": [
    "Malkajgiri", "Medchal", "Quthbullapur", "Kukatpally", "Uppal", 
    "Ghatkesar", "Keesara", "Alwal", "Balanagar", "Dundigal Gandimaisamma", 
    "Shamirpet", "Bachupally"
  ],
  "Visakhapatnam": [
    "Bheemunipatnam", "Visakhapatnam Rural", "Visakhapatnam Urban", 
    "Maharani Peta", "Pendurthi", "Anandapuram", "Padmanabham", "Gajuwaka"
  ],
  "NTR": [
    "Vijayawada Urban", "Vijayawada Rural", "Ibrahimpatnam", "G.Konduru", 
    "Mylavaram", "Nandigama", "Kanchikacherla", "Jaggayyapeta"
  ],
  "Guntur": [
    "Guntur East", "Guntur West", "Mangalagiri", "Tadepalle", "Tenali", 
    "Ponnur", "Chebrolu", "Kakumanu", "Pedakakani", "Duggirala", "Kollipara"
  ]
};
