local screenSizeX = display.contentWidth
local screenSizeY = display.contentHeight
local centerX = display.contentWidth * 0.5
local centerY = display.contentHeight * 0.5
local settingsUtil = require("scripts.utils.Settings")
local opponent = require("scripts.commons.Opponent")
local Player = require("scripts.commons.Player")
local valueTable = {
  value1 = 20000,
  value2 = 15000,
  value3 = 10000,
  value4 = 7000,
  value5 = 5000,
  value6 = 3000
}
local localtionTable = {
  localtion1 = 5,
  localtion2 = 4,
  localtion3 = 3,
  localtion4 = 2,
  localtion5 = 1
}
local origValuesTable = {
  {
    value = valueTable.value1,
    imageLight = "prize_" .. localtionTable.localtion1 .. "_" .. valueTable.value1 .. "_l_light",
    imageDark = "prize_" .. localtionTable.localtion1 .. "_" .. valueTable.value1 .. "_l_dark"
  },
  {
    value = valueTable.value2,
    imageLight = "prize_" .. localtionTable.localtion1 .. "_" .. valueTable.value2 .. "_r_light",
    imageDark = "prize_" .. localtionTable.localtion1 .. "_" .. valueTable.value2 .. "_r_dark"
  },
  {
    value = valueTable.value2,
    imageLight = "prize_" .. localtionTable.localtion2 .. "_" .. valueTable.value2 .. "_l_light",
    imageDark = "prize_" .. localtionTable.localtion2 .. "_" .. valueTable.value2 .. "_l_dark"
  },
  {
    value = valueTable.value3,
    imageLight = "prize_" .. localtionTable.localtion2 .. "_" .. valueTable.value3 .. "_r_light",
    imageDark = "prize_" .. localtionTable.localtion2 .. "_" .. valueTable.value3 .. "_r_dark"
  },
  {
    value = valueTable.value3,
    imageLight = "prize_" .. localtionTable.localtion3 .. "_" .. valueTable.value3 .. "_l_light",
    imageDark = "prize_" .. localtionTable.localtion3 .. "_" .. valueTable.value3 .. "_l_dark"
  },
  {
    value = valueTable.value3,
    imageLight = "prize_" .. localtionTable.localtion3 .. "_" .. valueTable.value3 .. "_r_light",
    imageDark = "prize_" .. localtionTable.localtion3 .. "_" .. valueTable.value3 .. "_r_dark"
  },
  {
    value = valueTable.value4,
    imageLight = "prize_" .. localtionTable.localtion4 .. "_" .. valueTable.value4 .. "_l_light",
    imageDark = "prize_" .. localtionTable.localtion4 .. "_" .. valueTable.value4 .. "_l_dark"
  },
  {
    value = valueTable.value4,
    imageLight = "prize_" .. localtionTable.localtion4 .. "_" .. valueTable.value5 .. "_r_light",
    imageDark = "prize_" .. localtionTable.localtion4 .. "_" .. valueTable.value5 .. "_r_dark"
  },
  {
    value = valueTable.value5,
    imageLight = "prize_" .. localtionTable.localtion5 .. "_" .. valueTable.value5 .. "_l_light",
    imageDark = "prize_" .. localtionTable.localtion5 .. "_" .. valueTable.value5 .. "_l_dark"
  },
  {
    value = valueTable.value6,
    imageLight = "prize_" .. localtionTable.localtion5 .. "_" .. valueTable.value6 .. "_r_light",
    imageDark = "prize_" .. localtionTable.localtion5 .. "_" .. valueTable.value6 .. "_r_dark"
  }
}
local origMaleOpponentTable = {
  {
    frame = "man0001",
    name = "Aberto",
    gender = "male"
  },
  {
    frame = "man0085",
    name = "Adriano",
    gender = "male"
  },
  {
    frame = "man0180",
    name = "Alberto",
    gender = "male"
  },
  {
    frame = "man0169",
    name = "Geovanni",
    gender = "male"
  },
  {
    frame = "man0033",
    name = "Lorenzo",
    gender = "male"
  },
  {
    frame = "man0037",
    name = "Lucca",
    gender = "male"
  },
  {
    frame = "man0046",
    name = "Antonio",
    gender = "male"
  },
  {
    frame = "man0002",
    name = "Mario",
    gender = "male"
  },
  {
    frame = "man0007",
    name = "Arturo",
    gender = "male"
  },
  {
    frame = "man0015",
    name = "Massimo",
    gender = "male"
  },
  {
    frame = "man0058",
    name = "Nico",
    gender = "male"
  },
  {
    frame = "man0064",
    name = "Paolo",
    gender = "male"
  },
  {
    frame = "man0112",
    name = "Primo",
    gender = "male"
  },
  {
    frame = "man0134",
    name = "Claudio",
    gender = "male"
  },
  {
    frame = "man0160",
    name = "Roberto",
    gender = "male"
  },
  {
    frame = "man0181",
    name = "Rocco",
    gender = "male"
  },
  {
    frame = "man0182",
    name = "Eduardo",
    gender = "male"
  },
  {
    frame = "man0183",
    name = "Raul",
    gender = "male"
  },
  {
    frame = "man0184",
    name = "Rosario",
    gender = "male"
  },
  {
    frame = "man0185",
    name = "Berry",
    gender = "male"
  },
  {
    frame = "man0115",
    name = "Enrico",
    gender = "male"
  },
  {
    frame = "man0124",
    name = "Fabio",
    gender = "male"
  },
  {
    frame = "man0022",
    name = "Silvio",
    gender = "male"
  },
  {
    frame = "man0023",
    name = "Francesco",
    gender = "male"
  },
  {
    frame = "man0024",
    name = "Vito",
    gender = "male"
  },
  {
    frame = "man0026",
    name = "Giorgio",
    gender = "male"
  },
  {
    frame = "man0027",
    name = "Gustavo",
    gender = "male"
  },
  {
    frame = "man0028",
    name = "Vitale",
    gender = "male"
  },
  {
    frame = "man0029",
    name = "Guido",
    gender = "male"
  },
  {
    frame = "man0032",
    name = "Marco",
    gender = "male"
  },
  {
    frame = "man0034",
    name = "Marcello",
    gender = "male"
  },
  {
    frame = "man0035",
    name = "Luigi",
    gender = "male"
  },
  {
    frame = "man0036",
    name = "Loretto",
    gender = "male"
  },
  {
    frame = "man0038",
    name = "Loris",
    gender = "male"
  },
  {
    frame = "man0039",
    name = "Jenoa",
    gender = "male"
  },
  {
    frame = "man0040",
    name = "Alonso",
    gender = "male"
  },
  {
    frame = "man0041",
    name = "Angelo",
    gender = "male"
  },
  {
    frame = "man0042",
    name = "Aldo",
    gender = "male"
  },
  {
    frame = "man0043",
    name = "Armani",
    gender = "male"
  },
  {
    frame = "man0044",
    name = "Amedeo",
    gender = "male"
  },
  {
    frame = "man0045",
    name = "Enzo",
    gender = "male"
  },
  {
    frame = "man0047",
    name = "Santino",
    gender = "male"
  },
  {
    frame = "italian_2",
    name = "Tony",
    gender = "male"
  },
  {
    frame = "italian_5",
    name = "Giulio",
    gender = "male"
  },
  {
    frame = "italian_7",
    name = "Sandro",
    gender = "male"
  },
  {
    frame = "italian_10",
    name = "Flavio",
    gender = "male"
  },
  {
    frame = "italian_12",
    name = "Gabriele",
    gender = "male"
  },
  {
    frame = "italian_13",
    name = "Samuel",
    gender = "male"
  },
  {
    frame = "italian_15",
    name = "John",
    gender = "male"
  },
  {
    frame = "italian_17",
    name = "Fred",
    gender = "male"
  },
  {
    frame = "italian_20",
    name = "Marco",
    gender = "male"
  },
  {
    frame = "italian_22",
    name = "Max",
    gender = "male"
  },
  {
    frame = "italian_24",
    name = "Fabrizio",
    gender = "male"
  },
  {
    frame = "italian_25",
    name = "Federico",
    gender = "male"
  },
  {
    frame = "italian_26",
    name = "Daniele",
    gender = "male"
  },
  {
    frame = "italian_30",
    name = "Iacopo",
    gender = "male"
  },
  {
    frame = "italian_32",
    name = "Fabio",
    gender = "male"
  },
  {
    frame = "italian_33",
    name = "Manuel",
    gender = "male"
  },
  {
    frame = "italian_34",
    name = "Davide",
    gender = "male"
  },
  {
    frame = "italian_35",
    name = "Eric",
    gender = "male"
  },
  {
    frame = "italian_38",
    name = "Jacob",
    gender = "male"
  },
  {
    frame = "italian_41",
    name = "Riccardo",
    gender = "male"
  },
  {
    frame = "italian_43",
    name = "Saverio",
    gender = "male"
  },
  {
    frame = "italian_45",
    name = "Ennio",
    gender = "male"
  },
  {
    frame = "italian_47",
    name = "Edoardo",
    gender = "male"
  },
  {
    frame = "italian_49",
    name = "Paolo",
    gender = "male"
  },
  {
    frame = "italian_51",
    name = "Enrico",
    gender = "male"
  },
  {
    frame = "italian_53",
    name = "Luca",
    gender = "male"
  },
  {
    frame = "italian_55",
    name = "Mirko",
    gender = "male"
  },
  {
    frame = "italian_57",
    name = "Jimmy",
    gender = "male"
  },
  {
    frame = "italian_59",
    name = "Giacomo",
    gender = "male"
  },
  {
    frame = "italian_61",
    name = "Samuel",
    gender = "male"
  },
  {
    frame = "italian_73",
    name = "Rudy",
    gender = "male"
  },
  {
    frame = "italian_75",
    name = "Albert",
    gender = "male"
  },
  {
    frame = "italian_82",
    name = "Elia",
    gender = "male"
  },
  {
    frame = "italian_83",
    name = "Emanuele",
    gender = "male"
  },
  {
    frame = "italian_86",
    name = "Emiliano",
    gender = "male"
  },
  {
    frame = "italian_93",
    name = "Gerardo",
    gender = "male"
  },
  {
    frame = "italian_94",
    name = "Gianluca",
    gender = "male"
  },
  {
    frame = "italian_97",
    name = "Gianpiero",
    gender = "male"
  },
  {
    frame = "italian_99",
    name = "Guido",
    gender = "male"
  },
  {
    frame = "italian_101",
    name = "Ivan",
    gender = "male"
  },
  {
    frame = "italian_104",
    name = "Igor",
    gender = "male"
  },
  {
    frame = "italian_108",
    name = "Lamberto",
    gender = "male"
  },
  {
    frame = "italian_112",
    name = "Lorenzo",
    gender = "male"
  },
  {
    frame = "italian_117",
    name = "Leonardo",
    gender = "male"
  },
  {
    frame = "italian_118",
    name = "Lanfranco",
    gender = "male"
  },
  {
    frame = "italian_120",
    name = "Lapo",
    gender = "male"
  },
  {
    frame = "italian_121",
    name = "Livio",
    gender = "male"
  },
  {
    frame = "italian_122",
    name = "Loris",
    gender = "male"
  },
  {
    frame = "italian_123",
    name = "Lino",
    gender = "male"
  },
  {
    frame = "italian_125",
    name = "Maurizio",
    gender = "male"
  },
  {
    frame = "italian_127",
    name = "Mauro",
    gender = "male"
  },
  {
    frame = "italian_129",
    name = "Moreno",
    gender = "male"
  },
  {
    frame = "italian_136",
    name = "Orazio",
    gender = "male"
  }
}
local origFemaleOpponentTable = {
  {
    frame = "woman0098",
    name = "Aria",
    gender = "female"
  },
  {
    frame = "woman0109",
    name = "Alessandra",
    gender = "female"
  },
  {
    frame = "woman0061",
    name = "Liliana",
    gender = "female"
  },
  {
    frame = "woman0070",
    name = "Carina",
    gender = "female"
  },
  {
    frame = "woman0078",
    name = "Valentina",
    gender = "female"
  },
  {
    frame = "woman0090",
    name = "Caterina",
    gender = "female"
  },
  {
    frame = "woman0096",
    name = "Adriana",
    gender = "female"
  },
  {
    frame = "woman0124",
    name = "Luciana",
    gender = "female"
  },
  {
    frame = "woman0133",
    name = "Rosa",
    gender = "female"
  },
  {
    frame = "woman0149",
    name = "Gianna",
    gender = "female"
  },
  {
    frame = "woman0155",
    name = "Lia",
    gender = "female"
  },
  {
    frame = "woman0163",
    name = "Eleonora",
    gender = "female"
  },
  {
    frame = "woman0171",
    name = "Daniela",
    gender = "female"
  },
  {
    frame = "woman0095",
    name = "Anna",
    gender = "female"
  },
  {
    frame = "woman0068",
    name = "Angelina",
    gender = "female"
  },
  {
    frame = "woman0031",
    name = "Mona",
    gender = "female"
  },
  {
    frame = "woman0032",
    name = "Paola",
    gender = "female"
  },
  {
    frame = "woman0033",
    name = "Debora",
    gender = "female"
  },
  {
    frame = "woman0034",
    name = "Donata",
    gender = "female"
  },
  {
    frame = "woman0035",
    name = "Renata",
    gender = "female"
  },
  {
    frame = "woman0036",
    name = "Eva",
    gender = "female"
  },
  {
    frame = "woman0037",
    name = "Fabiana",
    gender = "female"
  },
  {
    frame = "woman0038",
    name = "Sofia",
    gender = "female"
  },
  {
    frame = "woman0039",
    name = "Simona",
    gender = "female"
  },
  {
    frame = "woman0040",
    name = "Stefania",
    gender = "female"
  },
  {
    frame = "woman0041",
    name = "Teresa",
    gender = "female"
  },
  {
    frame = "woman0042",
    name = "Gabriella",
    gender = "female"
  },
  {
    frame = "woman0043",
    name = "Viviana",
    gender = "female"
  },
  {
    frame = "woman0044",
    name = "Vittoria",
    gender = "female"
  },
  {
    frame = "woman0045",
    name = "Maria",
    gender = "female"
  },
  {
    frame = "woman0046",
    name = "Marcella",
    gender = "female"
  },
  {
    frame = "woman0047",
    name = "Mia",
    gender = "female"
  },
  {
    frame = "woman0048",
    name = "Mirella",
    gender = "female"
  },
  {
    frame = "woman0050",
    name = "Orsola",
    gender = "female"
  },
  {
    frame = "italian_1",
    name = "Katia",
    gender = "female"
  },
  {
    frame = "italian_3",
    name = "Silvia",
    gender = "female"
  },
  {
    frame = "italian_4",
    name = "Becky",
    gender = "female"
  },
  {
    frame = "italian_6",
    name = "Marzia",
    gender = "female"
  },
  {
    frame = "italian_8",
    name = "Stefania",
    gender = "female"
  },
  {
    frame = "italian_9",
    name = "Lisa",
    gender = "female"
  },
  {
    frame = "italian_11",
    name = "Romina",
    gender = "female"
  },
  {
    frame = "italian_14",
    name = "Paola",
    gender = "female"
  },
  {
    frame = "italian_16",
    name = "Sara",
    gender = "female"
  },
  {
    frame = "italian_18",
    name = "Licia",
    gender = "female"
  },
  {
    frame = "italian_19",
    name = "Simona",
    gender = "female"
  },
  {
    frame = "italian_21",
    name = "Eleonora",
    gender = "female"
  },
  {
    frame = "italian_23",
    name = "Giorgia",
    gender = "female"
  },
  {
    frame = "italian_27",
    name = "Olivia",
    gender = "female"
  },
  {
    frame = "italian_28",
    name = "Andrea",
    gender = "female"
  },
  {
    frame = "italian_29",
    name = "Laura",
    gender = "female"
  },
  {
    frame = "italian_31",
    name = "Daniela",
    gender = "female"
  },
  {
    frame = "italian_36",
    name = "Valentina",
    gender = "female"
  },
  {
    frame = "italian_37",
    name = "Gemma",
    gender = "female"
  },
  {
    frame = "italian_39",
    name = "Valeria",
    gender = "female"
  },
  {
    frame = "italian_40",
    name = "Serena",
    gender = "female"
  },
  {
    frame = "italian_42",
    name = "Pamela",
    gender = "female"
  },
  {
    frame = "italian_44",
    name = "Licia",
    gender = "female"
  },
  {
    frame = "italian_46",
    name = "Silvia",
    gender = "female"
  },
  {
    frame = "italian_48",
    name = "Carolina",
    gender = "female"
  },
  {
    frame = "italian_50",
    name = "Giorgia",
    gender = "female"
  },
  {
    frame = "italian_52",
    name = "Isabella",
    gender = "female"
  },
  {
    frame = "italian_54",
    name = "Sinzia",
    gender = "female"
  },
  {
    frame = "italian_56",
    name = "Joanna",
    gender = "female"
  },
  {
    frame = "italian_56",
    name = "Luna",
    gender = "female"
  },
  {
    frame = "italian_58",
    name = "Jasmine",
    gender = "female"
  },
  {
    frame = "italian_60",
    name = "Olivia",
    gender = "female"
  },
  {
    frame = "italian_62",
    name = "Judy",
    gender = "female"
  },
  {
    frame = "italian_63",
    name = "Samy",
    gender = "female"
  },
  {
    frame = "italian_64",
    name = "Lavinia",
    gender = "female"
  },
  {
    frame = "italian_65",
    name = "Letizia",
    gender = "female"
  },
  {
    frame = "italian_66",
    name = "Lara",
    gender = "female"
  },
  {
    frame = "italian_67",
    name = "Bianca",
    gender = "female"
  },
  {
    frame = "italian_68",
    name = "Barbara",
    gender = "female"
  },
  {
    frame = "italian_69",
    name = "Jenny",
    gender = "female"
  },
  {
    frame = "italian_70",
    name = "Benedetta",
    gender = "female"
  },
  {
    frame = "italian_71",
    name = "Cristina",
    gender = "female"
  },
  {
    frame = "italian_72",
    name = "Gina",
    gender = "female"
  },
  {
    frame = "italian_74",
    name = "Giada",
    gender = "female"
  },
  {
    frame = "italian_76",
    name = "Alice",
    gender = "female"
  },
  {
    frame = "italian_77",
    name = "Carmen",
    gender = "female"
  },
  {
    frame = "italian_78",
    name = "Margherita",
    gender = "female"
  },
  {
    frame = "italian_79",
    name = "Cleo",
    gender = "female"
  },
  {
    frame = "italian_80",
    name = "Cora",
    gender = "female"
  },
  {
    frame = "italian_81",
    name = "Debora",
    gender = "female"
  },
  {
    frame = "italian_84",
    name = "Emma",
    gender = "female"
  },
  {
    frame = "italian_85",
    name = "Eva",
    gender = "female"
  },
  {
    frame = "italian_87",
    name = "Fabiola",
    gender = "female"
  },
  {
    frame = "italian_88",
    name = "Floriana",
    gender = "female"
  },
  {
    frame = "italian_89",
    name = "Fiore",
    gender = "female"
  },
  {
    frame = "italian_90",
    name = "Gabriella",
    gender = "female"
  },
  {
    frame = "italian_91",
    name = "Giulia",
    gender = "female"
  },
  {
    frame = "italian_92",
    name = "Grazia",
    gender = "female"
  },
  {
    frame = "italian_95",
    name = "Giuliana",
    gender = "female"
  },
  {
    frame = "italian_96",
    name = "Ginevra",
    gender = "female"
  },
  {
    frame = "italian_98",
    name = "Greta",
    gender = "female"
  },
  {
    frame = "italian_100",
    name = "Guendalina",
    gender = "female"
  },
  {
    frame = "italian_102",
    name = "Irene",
    gender = "female"
  },
  {
    frame = "italian_103",
    name = "Iole",
    gender = "female"
  },
  {
    frame = "italian_105",
    name = "Ida",
    gender = "female"
  },
  {
    frame = "italian_106",
    name = "Iris",
    gender = "female"
  },
  {
    frame = "italian_107",
    name = "Lidia",
    gender = "female"
  },
  {
    frame = "italian_109",
    name = "Loredana",
    gender = "female"
  },
  {
    frame = "italian_110",
    name = "Luisa",
    gender = "female"
  },
  {
    frame = "italian_111",
    name = "Lucilla",
    gender = "female"
  },
  {
    frame = "italian_113",
    name = "Lelia",
    gender = "female"
  },
  {
    frame = "italian_114",
    name = "Lorella",
    gender = "female"
  },
  {
    frame = "italian_115",
    name = "Marianna",
    gender = "female"
  },
  {
    frame = "italian_116",
    name = "Marta",
    gender = "female"
  },
  {
    frame = "italian_119",
    name = "Marcella",
    gender = "female"
  },
  {
    frame = "italian_124",
    name = "Marina",
    gender = "female"
  },
  {
    frame = "italian_126",
    name = "Melissa",
    gender = "female"
  },
  {
    frame = "italian_128",
    name = "Michela",
    gender = "female"
  },
  {
    frame = "italian_130",
    name = "Milena",
    gender = "female"
  },
  {
    frame = "italian_131",
    name = "Mia",
    gender = "female"
  },
  {
    frame = "italian_132",
    name = "Nicoletta",
    gender = "female"
  },
  {
    frame = "italian_133",
    name = "Nadia",
    gender = "female"
  },
  {
    frame = "italian_134",
    name = "Noemi",
    gender = "female"
  },
  {
    frame = "italian_135",
    name = "Ornella",
    gender = "female"
  },
  {
    frame = "italian_137",
    name = "Ofelia",
    gender = "female"
  }
}
local bodiesM = {
  {
    name = "seq1_suit-hd",
    body = "player_body1"
  },
  {
    name = "seq4_sweater-hd",
    body = "player_body4"
  },
  {
    name = "seq1_suit-hd",
    body = "player_body1"
  },
  {
    name = "seq4_sweater-hd",
    body = "player_body4"
  },
  {
    name = "seq1_suit-hd",
    body = "player_body1"
  },
  {
    name = "seq4_sweater-hd",
    body = "player_body4"
  },
  {
    name = "seq1_suit-hd",
    body = "player_body1"
  },
  {
    name = "seq4_sweater-hd",
    body = "player_body4"
  }
}
local bodiesF = {
  {
    name = "seq2_hasuda-hd",
    body = "player_body2"
  },
  {
    name = "seq3_yellow-hd",
    body = "player_body3"
  },
  {
    name = "seq2_hasuda-hd",
    body = "player_body2"
  },
  {
    name = "seq3_yellow-hd",
    body = "player_body3"
  },
  {
    name = "seq2_hasuda-hd",
    body = "player_body2"
  },
  {
    name = "seq3_yellow-hd",
    body = "player_body3"
  },
  {
    name = "seq2_hasuda-hd",
    body = "player_body2"
  },
  {
    name = "seq3_yellow-hd",
    body = "player_body3"
  }
}
local angleTable = {
  306,
  342,
  18,
  54,
  90,
  126,
  162,
  198,
  234,
  270
}
local GameUtils = {}

local function shallowcopy(orig)
  local orig_type = type(orig)
  local copy
  if orig_type == "table" then
    copy = {}
    for orig_key, orig_value in pairs(orig) do
      copy[orig_key] = orig_value
    end
  else
    copy = orig
  end
  return copy
end

function GameUtils.initPlayer()
  local p = Player.New()
  return p
end

function GameUtils.initOppponents()
  local randNumber = 0
  local valuesTable = shallowcopy(origValuesTable)
  local imageTableMale = shallowcopy(origMaleOpponentTable)
  local imageTableFemale = shallowcopy(origFemaleOpponentTable)
  local oppponents = {}
  for i = 1, 10 do
    oppponents[i] = opponent.New()
    oppponents[i].stage = "Screen_1/stage.png"
    oppponents[i].angle = angleTable[i]
    math.randomseed(os.time() + #valuesTable)
    randNumber = math.random(1, #valuesTable)
    oppponents[i].id = i
    oppponents[i].value = valuesTable[randNumber].value
    oppponents[i].valueImageFrame = valuesTable[randNumber].imageLight
    oppponents[i].valueImageOffFrame = valuesTable[randNumber].imageDark
    table.remove(valuesTable, randNumber)
    math.randomseed(os.time() + randNumber)
    randNumber = math.random(0, 1)
    math.randomseed(os.time() + math.random(20, 100) + randNumber + i)
    oppponents[i].level = math.random(40, 100)
    if i % 2 == 1 then
      math.randomseed(os.time() + #imageTableMale)
      randNumber = math.random(1, #imageTableMale)
      oppponents[i].imageFile = imageTableMale[randNumber].frame
      oppponents[i].name = imageTableMale[randNumber].name
      table.remove(imageTableMale, randNumber)
      oppponents[i].gender = "male"
      math.randomseed(os.time() + randNumber)
      randNumber = math.random(1, #bodiesM)
      oppponents[i].body = bodiesM[randNumber].name
    else
      math.randomseed(os.time() + #imageTableFemale)
      randNumber = math.random(1, #imageTableFemale)
      oppponents[i].imageFile = imageTableFemale[randNumber].frame
      oppponents[i].name = imageTableFemale[randNumber].name
      table.remove(imageTableFemale, randNumber)
      oppponents[i].gender = "female"
      math.randomseed(os.time() + randNumber)
      randNumber = math.random(1, #bodiesF)
      oppponents[i].body = bodiesF[randNumber].name
    end
    log:log("Selected Body ", oppponents[i].body)
  end
  return oppponents
end

function GameUtils.buildCastFromShow()
  local rivals = persistenceUtil.getRecordedGame().rivals
  local showRivals = {}
  for k, v in pairs(rivals) do
    local rival = {}
    rival.frame = k
    rival.name = v.name
    rival.gender = (v.gender == "F" or v.gender == "female") and "female" or "male"
    rival.value = v.money_to_win
    table.insert(showRivals, rival)
  end
  return showRivals
end

local function findIndexByValue(valuesTable, value)
  for k, v in pairs(valuesTable) do
    if v.value == value then
      return k
    end
  end
end

function GameUtils.initShowOpponents()
  math.randomseed(os.time())
  local indexNumber = 0
  math.random()
  indexNumber = math.random(0, 1)
  local valuesTable = shallowcopy(origValuesTable)
  local castFromShow = GameUtils.buildCastFromShow()
  local imageTable = shallowcopy(castFromShow)
  local opponents = {}
  for i = 1, 10 do
    opponents[i] = opponent.New()
    opponents[i].stage = "Screen_1/stage.png"
    opponents[i].angle = angleTable[i]
    opponents[i].imageFile = imageTable[i].frame
    opponents[i].name = imageTable[i].name
    opponents[i].gender = imageTable[i].gender
    opponents[i].value = imageTable[i].value
    math.randomseed(os.time() + #valuesTable)
    opponents[i].id = i
    opponents[i].level = math.random(40, 100)
    indexNumber = findIndexByValue(valuesTable, opponents[i].value)
    opponents[i].value = valuesTable[indexNumber].value
    opponents[i].valueImageFrame = valuesTable[indexNumber].imageLight
    opponents[i].valueImageOffFrame = valuesTable[indexNumber].imageDark
    table.remove(valuesTable, indexNumber)
    if opponents[i].gender == "male" then
      math.randomseed(os.time() + #bodiesM)
      local randNumber = math.random(1, #bodiesM)
      opponents[i].body = bodiesM[randNumber].name
    else
      math.randomseed(os.time() + #bodiesF)
      local randNumber = math.random(1, #bodiesF)
      opponents[i].body = bodiesF[randNumber].name
    end
  end
  return opponents
end

function GameUtils.numberOfOppponentsLeft(oppponents)
  local numberOfOppponents = 0
  for i = 1, 10 do
    if oppponents[i].playerStatus == true then
      numberOfOppponents = numberOfOppponents + 1
    end
  end
  return tostring(numberOfOppponents)
end

function GameUtils.endGame()
  player.score = 0
  player.roundNumber = 0
  player.questionNumber = 0
  settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isUseHelp, "false")
  if showMode then
    showMode = false
  end
end

function GameUtils.createBgImage(fileNAme)
  local background = display.newImageRect(fileNAme, 740, 1160)
  background.anchorX = 0.5
  background.anchorY = 0.5
  background.y = centerY
  background.x = centerX
  return background
end

function GameUtils.getPlayerImage()
  local defaultAvaterBaseDir = "Assets/Images/"
  if settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.CustomImage) == "true" then
    return system.DocumentsDirectory, settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.LastImageName)
  elseif settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.GenderType) == "male" then
    return nil, defaultAvaterBaseDir .. "avatar_man.png"
  else
    return nil, defaultAvaterBaseDir .. "avatar_woman.png"
  end
end

function GameUtils.getPlayerGender()
  return settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.GenderType)
end

function GameUtils.getPlayerName()
  local name = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerName)
  if name == nil or name == "" then
    return messagesUtil.Messges.YOUR_TURN
  else
    return name
  end
end

function GameUtils.updateGamePlayed()
  local gamePlayed = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.GamesPlayed)
  gamePlayed = gamePlayed + 1
  settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.GamesPlayed, gamePlayed)
end

function GameUtils.isImageRotationAccordingToPlatform()
  local imageType = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.imageType)
  log:log("imageType", imageType)
  if platformName ~= "Android" and imageType == "camera" then
    log:log("imageType return true")
    return true
  end
  log:log("imageType return false")
  return false
end

function GameUtils.setPlayerBody()
  local gender = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.GenderType)
  if gender == "male" then
    math.randomseed(os.time() + #bodiesM)
    local randNumber = math.random(1, #bodiesM)
    player.body = bodiesM[randNumber].name
    player.stageBody = bodiesM[randNumber].body
  else
    math.randomseed(os.time() + #bodiesF)
    local randNumber = math.random(1, #bodiesF)
    player.body = bodiesF[randNumber].name
    player.stageBody = bodiesF[randNumber].body
  end
end

function GameUtils.loadPeopleSprite()
  local ppl_sheetData, ppl_sheet
  if showMode then
    ppl_sheetData = require("scripts.utils.show_sprite")
    local fileName = settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.recordedGameId) .. ".png"
    ppl_sheet = graphics.newImageSheet(fileName, system.DocumentsDirectory, ppl_sheetData.sheet)
  else
    ppl_sheetData = require("scripts.utils.ppl_sprite")
    ppl_sheet = graphics.newImageSheet(imagesAssets .. "ppl_sprite.jpg", ppl_sheetData.sheet)
  end
  return ppl_sheetData, ppl_sheet
end

return GameUtils
