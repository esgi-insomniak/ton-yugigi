export enum CardAttribute {
  DARK = "DARK",
  DIVINE = "DIVINE",
  EARTH = "EARTH",
  FIRE = "FIRE",
  LIGHT = "LIGHT",
  WATER = "WATER",
  WIND = "WIND",
}

export enum CardType {
  SPELL_CARD = "Spell Card",
  TRAP_CARD = "Trap Card",
  SKILL_CARD = "Skill Card",
  EFFECT_MONSTER = "Effect Monster",
  TUNER_MONSTER = "Tuner Monster",
  LINK_MONSTER = "Link Monster",
  NORMAL_MONSTER = "Normal Monster",
  SYNCHRO_TUNER_MONSTER = "Synchro Tuner Monster",
  FUSION_MONSTER = "Fusion Monster",
  PENDULUM_NORMAL_MONSTER = "Pendulum Normal Monster",
  XYZ_MONSTER = "XYZ Monster",
  PENDULUM_EFFECT_MONSTER = "Pendulum Effect Monster",
  RITUAL_EFFECT_MONSTER = "Ritual Effect Monster",
  UNION_EFFECT_MONSTER = "Union Effect Monster",
  SYNCHRO_MONSTER = "Synchro Monster",
  FLIP_EFFECT_MONSTER = "Flip Effect Monster",
  GEMINI_MONSTER = "Gemini Monster",
  SPIRIT_MONSTER = "Spirit Monster",
  TOKEN = "Token",
  PENDULUM_EFFECT_FUSION_MONSTER = "Pendulum Effect Fusion Monster",
  RITUAL_MONSTER = "Ritual Monster",
  TOON_MONSTER = "Toon Monster",
  XYZ_PENDULUM_EFFECT_MONSTER = "XYZ Pendulum Effect Monster",
  NORMAL_TUNER_MONSTER = "Normal Tuner Monster",
  PENDULUM_TUNER_EFFECT_MONSTER = "Pendulum Tuner Effect Monster",
  SYNCHRO_PENDULUM_EFFECT_MONSTER = "Synchro Pendulum Effect Monster",
  PENDULUM_EFFECT_RITUAL_MONSTER = "Pendulum Effect Ritual Monster",
  PENDULUM_FLIP_EFFECT_MONSTER = "Pendulum Flip Effect Monster",
}

export enum CardFrameType {
  SPELL = "spell",
  TRAP = "trap",
  SKILL = "skill",
  EFFECT = "effect",
  LINK = "link",
  NORMAL = "normal",
  SYNCHRO = "synchro",
  FUSION = "fusion",
  NORMAL_PENDULUM = "normal_pendulum",
  XYZ = "xyz",
  EFFECT_PENDULUM = "effect_pendulum",
  RITUAL = "ritual",
  TOKEN = "token",
  FUSION_PENDULUM = "fusion_pendulum",
  XYZ_PENDULUM = "xyz_pendulum",
  SYNCHRO_PENDULUM = "synchro_pendulum",
  RITUAL_PENDULUM = "ritual_pendulum",
}

export enum CardRarity {
  "10000 Secret Rare" = "10000 Secret Rare",
  StR = "Starlight Rare",
  GGR = "Ghost/Gold Rare",
  GR = "Ghost Rare",
  UScR = "Ultra Secret Rare",
  "Extra Secret Rare" = "Extra Secret Rare",
  "Extra Secret" = "Extra Secret",
  "Quarter Century Secret Rare" = "Quarter Century Secret Rare",
  QCScR = "QCScR",
  PS = "Platinum Secret Rare",
  CR = "Collector's Rare",
  PScR = "Prismatic Secret Rare",
  GScR = "Gold Secret Rare",
  ScR = "Secret Rare",
  PIR = "Platinum Rare",
  PG = "Premium Gold Rare",
  GUR = "Gold Rare",
  UtR = "Ultimate Rare",
  UPR = "Ultra Parallel Rare",
  DUPR = "Duel Terminal Ultra Parallel Rare",
  "Ultra Rare (Pharaoh's Rare)" = "Ultra Rare (Pharaoh's Rare)",
  UR = "Ultra Rare",
  SPR = "Super Parallel Rare",
  DSPR = "Duel Terminal Super Parallel Rare",
  SR = "Super Rare",
  "Duel Terminal Normal Rare Parallel Rare" = "Duel Terminal Normal Rare Parallel Rare",
  DRPR = "Duel Terminal Rare Parallel Rare",
  SHR = "Shatterfoil Rare",
  SFR = "Starfoil Rare",
  Starfoil = "Starfoil",
  MSR = "Mosaic Rare",
  R = "Rare",
  "Normal Parallel Rare" = "Normal Parallel Rare",
  DNPR = "Duel Terminal Normal Parallel Rare",
  SSP = "Super Short Print",
  SP = "Short Print",
  c = "c",
  C = "Common",
}

export enum CardRace {
  EQUIP = "Equip",
  NORMAL = "Normal",
  CONTINUOUS = "Continuous",
  DAVID = "David",
  QUICK_PLAY = "Quick-Play",
  FRIEND = "Friend",
  BEAST = "Beast",
  BEAST_WARRIOR = "Beast-Warrior",
  INSECT = "Insect",
  DRAGON = "Dragon",
  WARRIOR = "Warrior",
  FAIRY = "Fairy",
  REPTILE = "Reptile",
  FISH = "Fish",
  CYBERSE = "Cyberse",
  MACHINE = "Machine",
  PSYCHIC = "Psychic",
  PLANT = "Plant",
  ARKANA = "Arkana",
  AQUA = "Aqua",
  FIELD = "Field",
  SPELLCASTER = "Spellcaster",
  DINOSAUR = "Dinosaur",
  WINGED_BEAST = "Winged Beast",
  PYRO = "Pyro",
  THUNDER = "Thunder",
  WYRM = "Wyrm",
  ROCK = "Rock",
  ZOMBIE = "Zombie",
  COUNTER = "Counter",
  KAIBA = "Kaiba",
  RITUAL = "Ritual",
  CHAZZ_PRINCET = "Chazz Princeton",
  KEITH = "Keith",
  SEA_SERPENT = "Sea Serpent",
  ALEXIS_RHODES = "Alexis Rhodes",
  ISHIZU_ISHTAR = "Ishizu Ishtar",
  YAMI_YUGI = "Yami Yugi",
  ESPA_ROBA = "Espa Roba",
  JOEY = "Joey",
  AXEL_BRODIE = "Axel Brodie",
  SETO_KAIBA = "Seto Kaiba",
  EMMA = "Emma",
  YAMI_MARIK = "Yami Marik",
  JESSE_ANDERSO = "Jesse Anderso",
  ISHIZU = "Ishizu",
  YAMI_BAKURA = "Yami Bakura",
  YUBEL = "Yubel",
  ANDREW = "Andrew",
  PEGASUS = "Pegasus",
  BONZ = "Bonz",
  CHRISTINE = "Christine",
  DR_VELLIAN_C = "Dr. Vellian C",
  ODION = "Odion",
  MAI_VALENTINE = "Mai Valentine",
  ASTER_PHOENIX = "Aster Phoenix",
  CREATOR_GOD = "Creator-God",
  WEEVIL = "Weevil",
  TYRANNO_HASSL = "Tyranno Hassl",
  JOEY_WHEELER = "Joey Wheeler",
  REX = "Rex",
  DIVINE_BEAST = "Divine-Beast",
  JADEN_YUKI = "Jaden Yuki",
  MAKO = "Mako",
  BASTION_MISAW = "Bastion Misaw",
  LUMIS_AND_UMB = "Lumis and Umb",
  YUGI = "Yugi",
  SYRUS_TRUESDA = "Syrus Truesda",
  TEA_GARDNER = "Tea Gardner",
  MAI = "Mai",
  ZANE_TRUESDAL = "Zane Truesdal",
}
