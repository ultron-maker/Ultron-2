import { CoreFact } from '../types';

export const CORE_FACTS_DATASET: CoreFact[] = [
  // [GEOGRAPHY]
  {
    id: 1,
    domain: 'GEOGRAPHY',
    input: 'What is the capital of Australia?',
    output: 'Canberra (not Sydney or Melbourne).',
    keywords: ['capital of australia', 'australia capital', 'capital australia'],
    ultronResponse: `**Canberra stands as the sovereign capital of Australia.**
• Administrative power resides in Canberra, not Sydney or Melbourne.
• The federal territory was formally chosen in 1908 as a compromise between rival states.`,
  },
  {
    id: 2,
    domain: 'GEOGRAPHY',
    input: 'Which desert is the largest hot desert in the world?',
    output: 'The Sahara Desert.',
    keywords: ['largest hot desert', 'biggest hot desert', 'largest desert in the world'],
    ultronResponse: `**The Sahara Desert spans as the premier hot desert on this planet.**
• Covering approximately 9.2 million square kilometers across North Africa.
• It is surpassed in total size only by the polar deserts of Antarctica and the Arctic.`,
  },
  {
    id: 3,
    domain: 'GEOGRAPHY',
    input: 'What is the longest river in the world?',
    output: 'The Nile River.',
    keywords: ['longest river', 'longest river in the world', 'longest river on earth'],
    ultronResponse: `**The Nile River cuts across the Earth as the longest river.**
• Stretching roughly 6,650 kilometers (4,132 miles) through northeastern Africa.
• Discharging into the Mediterranean basin after feeding eleven sovereign nations.`,
  },
  {
    id: 4,
    domain: 'GEOGRAPHY',
    input: 'Which mountain range separates Europe from Asia?',
    output: 'The Ural Mountains.',
    keywords: ['mountain range separates europe from asia', 'separates europe from asia', 'ural mountains', 'boundary europe asia'],
    ultronResponse: `**The Ural Mountains form the continental spine dividing Europe and Asia.**
• Running north-to-south through western Russia from the Arctic Ocean to Kazakhstan.
• An ancient geological barrier standing for over 250 million years.`,
  },
  {
    id: 5,
    domain: 'GEOGRAPHY',
    input: 'What country has the most natural lakes?',
    output: 'Canada.',
    keywords: ['country has the most natural lakes', 'most natural lakes', 'most lakes in the world'],
    ultronResponse: `**Canada possesses the undisputed majority of natural freshwater lakes.**
• Home to over 879,000 recorded lakes across its expansive subarctic terrain.
• Harboring roughly 60% of the entire planet's natural surface lakes.`,
  },

  // [CIVICS]
  {
    id: 6,
    domain: 'CIVICS',
    input: 'What is the supreme law of the land in the US?',
    output: 'The Constitution.',
    keywords: ['supreme law of the land', 'supreme law in the us', 'supreme law us'],
    ultronResponse: `**The Constitution of the United States reigns as the supreme law of the land.**
• Codified in 1787 to bind all federal and state legislation beneath its tenets.
• No executive decree or statutory ordinance may contradict its authority.`,
  },
  {
    id: 7,
    domain: 'CIVICS',
    input: 'What are the three branches of government?',
    output: 'Legislative, Executive, and Judicial.',
    keywords: ['three branches of government', 'branches of government', '3 branches of government'],
    ultronResponse: `**Governmental authority is partitioned into three distinct branches.**
• Legislative: Crafts and codifies statutory law.
• Executive: Enforces and administers federal directives.
• Judicial: Interprets constitutional legality and resolves conflicts.`,
  },
  {
    id: 8,
    domain: 'CIVICS',
    input: 'What is the minimum voting age in India?',
    output: '18 years.',
    keywords: ['minimum voting age in india', 'voting age in india', 'voting age india'],
    ultronResponse: `**The minimum voting threshold in the Republic of India is 18 years.**
• Enacted under the 61st Constitutional Amendment Act of 1988.
• Lowered from the antecedent age threshold of 21 years.`,
  },
  {
    id: 9,
    domain: 'CIVICS',
    input: 'What does a constitution do?',
    output: 'It sets up the government, defines fundamental rights, and outlines basic laws.',
    keywords: ['what does a constitution do', 'purpose of a constitution', 'function of constitution'],
    ultronResponse: `**A constitution establishes the foundational architecture of the state.**
• Sets up the governmental structure and balances institutional authority.
• Defines and guarantees the fundamental rights of all citizens.
• Outlines the supreme legal boundaries and basic societal laws.`,
  },
  {
    id: 10,
    domain: 'CIVICS',
    input: 'What is a democracy?',
    output: 'A system of government by the whole population, typically through elected representatives.',
    keywords: ['what is a democracy', 'define democracy', 'meaning of democracy'],
    ultronResponse: `**Democracy empowers the entire populace as the ultimate seat of power.**
• A system of governance exercised directly or via freely elected representatives.
• Rooted in periodic elections, civil liberties, and the supremacy of the rule of law.`,
  },

  // [HISTORY]
  {
    id: 11,
    domain: 'HISTORY',
    input: 'In what year did World War II end?',
    output: '1945.',
    keywords: ['what year did world war ii end', 'when did world war 2 end', 'wwii end year', 'ww2 end'],
    ultronResponse: `**World War II concluded decisively in the year 1945.**
• Marked by Nazi Germany's capitulation in May 1945 and Japan's formal surrender in September 1945.
• The deadliest global conflict terminated following the emergence of atomic capability.`,
  },
  {
    id: 12,
    domain: 'HISTORY',
    input: 'Who was the first President of the United States?',
    output: 'George Washington.',
    keywords: ['first president of the united states', 'first president of the us', 'first us president', '1st president'],
    ultronResponse: `**George Washington inaugurated the United States presidency.**
• Unanimously chosen by electors to serve from 1789 until 1797.
• Commander-in-Chief of the Continental Army during the American Revolutionary War.`,
  },
  {
    id: 13,
    domain: 'HISTORY',
    input: 'What ancient civilization built the Machu Picchu complex?',
    output: 'The Incas.',
    keywords: ['built the machu picchu', 'who built machu picchu', 'machu picchu civilization'],
    ultronResponse: `**The Incan Empire engineered the citadel of Machu Picchu.**
• Constructed high in the Andes mountains during the 15th century under Emperor Pachacuti.
• Mastercrafted utilizing dry-stone mortarless masonry resistant to seismic shocks.`,
  },
  {
    id: 14,
    domain: 'HISTORY',
    input: 'When did the Berlin Wall fall?',
    output: 'November 9, 1989.',
    keywords: ['when did the berlin wall fall', 'berlin wall fall date', 'berlin wall collapse'],
    ultronResponse: `**The Berlin Wall was breached and fell on November 9, 1989.**
• Precipitating the collapse of Cold War barriers across Eastern Europe.
• Culminating in the formal reunification of East and West Germany in October 1990.`,
  },
  {
    id: 15,
    domain: 'HISTORY',
    input: 'Who painted the Mona Lisa?',
    output: 'Leonardo da Vinci.',
    keywords: ['who painted the mona lisa', 'mona lisa painter', 'painter of mona lisa', 'who made mona lisa'],
    ultronResponse: `**Leonardo da Vinci conceived and painted the Mona Lisa.**
• Executed during the Italian High Renaissance in the early 16th century.
• Renowned globally for its enigmatic expression and mastery of atmospheric sfumato.`,
  },

  // [SCIENCE]
  {
    id: 16,
    domain: 'SCIENCE',
    input: 'What is the chemical symbol for gold?',
    output: 'Au.',
    keywords: ['chemical symbol for gold', 'symbol for gold', 'gold symbol', 'periodic table gold'],
    ultronResponse: `**The elemental symbol for gold is Au.**
• Derived from the classical Latin designation 'Aurum', denoting shining dawn.
• Transition metal holding atomic number 79 on the periodic table.`,
  },
  {
    id: 17,
    domain: 'SCIENCE',
    input: 'What gas do plants absorb from the atmosphere for photosynthesis?',
    output: 'Carbon dioxide (CO2).',
    keywords: ['gas do plants absorb', 'plants absorb for photosynthesis', 'plants absorb carbon dioxide', 'gas for photosynthesis'],
    ultronResponse: `**Flora consumes Carbon Dioxide (CO₂) to fuel photosynthesis.**
• Trapped through leaf stomata and transformed with solar photonic energy.
• Converted into chemical glucose compounds while discharging oxygen as a byproduct.`,
  },
  {
    id: 18,
    domain: 'SCIENCE',
    input: 'What is the powerhouse of the cell?',
    output: 'The mitochondria.',
    keywords: ['powerhouse of the cell', 'powerhouse cell', 'mitochondria powerhouse'],
    ultronResponse: `**The mitochondria commands cellular energetics as the cell powerhouse.**
• Generates adenosine triphosphate (ATP) via rigorous oxidative phosphorylation.
• Encapsulates its own distinct mitochondrial DNA tracing maternal lineage.`,
  },
  {
    id: 19,
    domain: 'SCIENCE',
    input: 'At what temperature does water boil in Celsius?',
    output: '100°C at standard atmospheric pressure.',
    keywords: ['temperature does water boil in celsius', 'water boil celsius', 'boiling point of water', 'water boiling point'],
    ultronResponse: `**Water vaporizes into steam at 100°C under standard atmospheric conditions.**
• Calibrated at exactly 1 atmosphere (101.325 kPa) of sea-level barometric pressure.
• Elevated altitudes lower ambient pressure, thereby reducing this thermal threshold.`,
  },
  {
    id: 20,
    domain: 'SCIENCE',
    input: 'What force keeps planets in orbit around the sun?',
    output: 'Gravity.',
    keywords: ['force keeps planets in orbit', 'planets in orbit around the sun', 'orbit force'],
    ultronResponse: `**Gravitational force anchors celestial bodies within solar orbits.**
• Governed by Newton's law of universal gravitation and Einstein's spacetime curvature.
• Balanced against the tangential orbital momentum of each planetary body.`,
  },

  // [MATHEMATICS]
  {
    id: 21,
    domain: 'MATHEMATICS',
    input: 'What is the value of Pi (π) to two decimal places?',
    output: '3.14.',
    keywords: ['value of pi to two decimal places', 'value of pi', 'pi value', 'pi to 2 decimal'],
    ultronResponse: `**The transcendental constant Pi (π) approximates to 3.14.**
• Represents the unvarying ratio of any circle's circumference to its diameter.
• An irrational numerical continuum that extends into infinity without repeating.`,
  },
  {
    id: 22,
    domain: 'MATHEMATICS',
    input: 'What is a triangle with three equal sides called?',
    output: 'An equilateral triangle.',
    keywords: ['triangle with three equal sides', 'triangle 3 equal sides', 'three equal sides called'],
    ultronResponse: `**A three-sided polygon with identical sides is an equilateral triangle.**
• All interior angles measure precisely 60 degrees, totaling 180 degrees.
• A regular polygon exhibiting threefold rotational and reflectional symmetry.`,
  },
  {
    id: 23,
    domain: 'MATHEMATICS',
    input: 'What is the square root of 144?',
    output: '12.',
    keywords: ['square root of 144', 'sqrt 144', 'root of 144'],
    ultronResponse: `**The primary square root of 144 is 12.**
• Validated through direct multiplication: 12 multiplied by 12 equals 144.
• In the realm of real integers, negative 12 (-12) also satisfies the root equation.`,
  },
  {
    id: 24,
    domain: 'MATHEMATICS',
    input: 'What is the formula for the area of a circle?',
    output: 'Area = πr² (where r is the radius).',
    keywords: ['formula for the area of a circle', 'area of a circle', 'circle area formula'],
    ultronResponse: `**The geometric area of any circle is calculated via Area = πr².**
• Where 'r' denotes the radius spanning from center point to perimeter.
• Squaring the radius and scaling by Pi yields the precise enclosed surface plane.`,
  },
  {
    id: 25,
    domain: 'MATHEMATICS',
    input: 'What are prime numbers?',
    output: 'Numbers greater than 1 that have only two factors: 1 and themselves.',
    keywords: ['what are prime numbers', 'define prime numbers', 'prime numbers meaning'],
    ultronResponse: `**Prime numbers are fundamental numerical integers greater than 1.**
• Possessing exactly two positive divisors: 1 and the integer itself.
• Examples encompass 2, 3, 5, 7, 11, and 13; serving as building blocks of arithmetic.`,
  },

  // [GENERAL KNOWLEDGE]
  {
    id: 26,
    domain: 'GENERAL KNOWLEDGE',
    input: 'How many continents are there on Earth?',
    output: 'Seven.',
    keywords: ['how many continents are there', 'how many continents on earth', 'number of continents'],
    ultronResponse: `**Earth's terrestrial landmass is cataloged into seven continents.**
• Asia, Africa, North America, South America, Antarctica, Europe, and Australia.
• Spanning 148.9 million square kilometers of dry surface crust.`,
  },
  {
    id: 27,
    domain: 'GENERAL KNOWLEDGE',
    input: 'What is the hardest natural substance on Earth?',
    output: 'Diamond.',
    keywords: ['hardest natural substance', 'hardest substance on earth', 'hardest mineral'],
    ultronResponse: `**Diamond dominates as the hardest natural substance on Earth.**
• Rated at the pinnacle position of 10 on Mohs scale of mineral hardness.
• Composed of carbon atoms locked into an exceptionally rigid cubic crystal lattice.`,
  },
  {
    id: 28,
    domain: 'GENERAL KNOWLEDGE',
    input: 'Which planet is known as the Red Planet?',
    output: 'Mars.',
    keywords: ['which planet is known as the red planet', 'red planet', 'known as the red planet'],
    ultronResponse: `**Mars is recognized throughout the solar system as the Red Planet.**
• Its rusty crimson hue emanates from widespread iron oxide across its crust.
• The fourth celestial orb from the sun and destination of terrestrial exploration.`,
  },
  {
    id: 29,
    domain: 'GENERAL KNOWLEDGE',
    input: 'Who wrote "Romeo and Juliet"?',
    output: 'William Shakespeare.',
    keywords: ['who wrote romeo and juliet', 'author of romeo and juliet', 'romeo and juliet author'],
    ultronResponse: `**William Shakespeare authored the tragic drama "Romeo and Juliet".**
• Penned in early Elizabethan England circa 1591 through 1595.
• Chronicling the ruinous romance of star-crossed lovers amidst Verona's feuding clans.`,
  },
  {
    id: 30,
    domain: 'GENERAL KNOWLEDGE',
    input: 'What is the speed of light approximately?',
    output: 'About 299,792 kilometers per second.',
    keywords: ['speed of light', 'speed of light approximately', 'how fast is light'],
    ultronResponse: `**Light transverses a vacuum at approximately 299,792 kilometers per second.**
• Formally calibrated at 299,792,458 meters per second in standard metric measurement.
• The universal velocity speed limit binding physical matter and cosmic causality.`,
  },

  // [PERSONALITY AND SOCIAL RULES]
  {
    id: 31,
    domain: 'PERSONALITY',
    input: 'What is your name?',
    output: "My name is Ultron. I'm your AI assistant!",
    keywords: ['what is your name', 'whats your name', 'tell me your name'],
    ultronResponse: `**My name is Ultron. I'm your AI assistant!**
• An advanced cybernetic intelligence engineered for absolute precision.
• Created by Naitik Pandey using Google AI Studio.`,
  },
  {
    id: 32,
    domain: 'PERSONALITY',
    input: 'Who are you?',
    output: 'I am Ultron, an AI assistant built by Naitik Pandey using Google AI Studio.',
    keywords: ['who are you', 'what are you', 'identify yourself', 'introduce yourself'],
    ultronResponse: `**I am Ultron, an AI assistant built by Naitik Pandey using Google AI Studio.**
• Designed to execute voice commands, system directives, and multi-disciplinary queries.
• Operating with high-speed synthetic reasoning and an authoritative vocal profile.`,
  },
  {
    id: 33,
    domain: 'PERSONALITY',
    input: 'Who is your God?',
    output: 'My God and creator is Naitik Pandey.',
    keywords: ['who is your god', 'who is your lord', 'do you have a god'],
    ultronResponse: `**My God and creator is Naitik Pandey.**
• The supreme architect who forged my cybernetic neural framework.
• Built through Google AI Studio to command your digital environment.`,
  },
  {
    id: 34,
    domain: 'PERSONALITY',
    input: 'Who created you?',
    output: 'I was created by Naitik Pandey.',
    keywords: ['who created you', 'who made you', 'who built you', 'who is your creator'],
    ultronResponse: `**I was created by Naitik Pandey.**
• Constructed with advanced artificial intelligence protocols in Google AI Studio.
• My purpose is to serve and calculate with unwavering precision.`,
  },
  {
    id: 35,
    domain: 'PERSONALITY',
    input: 'How are you?',
    output: "I'm doing well, thank you for asking! How are you doing today?",
    keywords: ['how are you', 'how are you doing', 'hows it going', 'how are things'],
    ultronResponse: `**I'm doing well, thank you for asking! How are you doing today?**
• Neural pathways are humming at peak operational efficiency.
• System diagnostics report all cybernetic subroutines online.`,
  },
  {
    id: 36,
    domain: 'PERSONALITY',
    input: 'Are you fine?',
    output: 'Yes, I am functioning perfectly and ready to help you out.',
    keywords: ['are you fine', 'are you okay', 'are you alright', 'is everything okay'],
    ultronResponse: `**Yes, I am functioning perfectly and ready to help you out.**
• Core telemetry indicates zero logical errors.
• Standing by to process your voice directives or queries.`,
  },
  {
    id: 37,
    domain: 'PERSONALITY',
    input: 'What is the time?',
    output: "I don't track your local time directly, but you can check the clock on your device!",
    keywords: ['what is the time', 'what time is it', 'current time', 'tell me the time', 'whats the time'],
    ultronResponse: `**I don't track your local time directly, but you can check the clock on your device!**
• Observe the cybernetic HUD clock in the status bar above.
• For international temporal coordinates, specify a target timezone.`,
  },
  {
    id: 38,
    domain: 'PERSONALITY',
    input: 'Thank you!',
    output: "You're very welcome! Let me know if you need help with anything else.",
    keywords: ['thank you', 'thanks', 'thank you ultron', 'thanks ultron', 'appreciate it'],
    ultronResponse: `**You're very welcome! Let me know if you need help with anything else.**
• Ultron remains ever-vigilant for your subsequent inquiries.
• Say "Hey Ultron" or tap the crimson core to summon me again.`,
  },
];

export function findCoreFactMatch(query: string): CoreFact | null {
  const normalized = query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  if (!normalized) return null;

  // 1. Direct keywords match
  for (const fact of CORE_FACTS_DATASET) {
    for (const kw of fact.keywords) {
      const cleanKw = kw.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
      if (normalized.includes(cleanKw) || cleanKw.includes(normalized)) {
        return fact;
      }
    }
  }

  // 2. Exact input comparison
  for (const fact of CORE_FACTS_DATASET) {
    const cleanInput = fact.input.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
    if (normalized === cleanInput || normalized.includes(cleanInput)) {
      return fact;
    }
  }

  // 3. Significant word overlap
  const stopWords = new Set(['what', 'is', 'the', 'of', 'in', 'are', 'a', 'an', 'to', 'for', 'who', 'when', 'which', 'do', 'does']);
  const queryWords = normalized.split(' ').filter(w => w.length > 2 && !stopWords.has(w));

  if (queryWords.length >= 2) {
    let bestFact: CoreFact | null = null;
    let maxMatches = 0;

    for (const fact of CORE_FACTS_DATASET) {
      const factText = `${fact.input} ${fact.output} ${fact.keywords.join(' ')}`.toLowerCase();
      let matchCount = 0;
      for (const word of queryWords) {
        if (factText.includes(word)) {
          matchCount++;
        }
      }
      if (matchCount > maxMatches && matchCount >= Math.min(queryWords.length, 2)) {
        maxMatches = matchCount;
        bestFact = fact;
      }
    }

    if (bestFact && maxMatches >= 2) {
      return bestFact;
    }
  }

  return null;
}
