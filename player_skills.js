if (!state.player) {
  state.player = {
    skills: [
      {
        name: "default",
        rate: 0.500,
        success: ["masterful", "remarkable", "flawless"],
        failure: ["clumsy", "inept", "futile"]
      },
      {
        name: "combat",
        rate: 0.500,
        success: ["ferocious", "deadly", "unyielding"],
        failure: ["misjudged", "ineffective", "reckless"]
      },
      {
        name: "command",
        rate: 0.800,
        success: ["tyrannical", "sinister", "merciless"],
        failure: ["disastrous", "pathetic", "inept"]
      },
      {
        name: "alchemy",
        rate: 0.750,
        success: ["masterful", "precise", "miraculous"],
        failure: ["explosive", "toxic", "useless"]
      },
      {
        name: "dark magic",
        rate: 0.850,
        success: ["twisted", "corrupt", "malevolent"],
        failure: ["chaotic", "meager", "backfired"]
      },
      {
        name: "diplomacy",
        rate: 0.350,
        success: ["persuasive", "convincing", "masterful"],
        failure: ["dismissed", "offensive", "ineffective"]
      }
    ]
  };
}

const isDefaultSkill = (skill) => skill.name === "default";

const getAdjective = (array) => array[Math.floor(Math.random() * array.length)];

// const getSkillByName = (name) => {
//   return state.player.skills.find(skill => skill.name.toLowerCase() === name.toLowerCase()) || state.player.skills[0];
// };

const getSkillByName = (name) => {
  let skill = state.player.skills.find(skill => skill.name.toLowerCase() === name.toLowerCase());
  if (!skill) {
    // If skill does not exist, create it with default attributes.
    skill = {
      name: name.toLowerCase(),
      rate: 0.5,  // Default rate
      success: ["masterful", "remarkable", "flawless"],  // Default success adjectives
      failure: ["clumsy", "inept", "futile"]  // Default failure adjectives
    };
    state.player.skills.push(skill);  // Add the new skill to the skills array
  }
  return skill;
};

const adjustSkillRate = (skill, isSuccess = false, isDecrease = false) => {
  if (isDefaultSkill(skill)) {
    return;
  }
  const maxRate = isSuccess ? 0.949 : 0.940;
  const minRate = isSuccess ? 0.501 : 0.510;
  const increment = isSuccess ? 0.001 : 0.01;
  if (isDecrease) {
    if (skill.rate >= minRate) {
      skill.rate -= 0.0005;
    }
  } else {
    if (skill.rate <= maxRate) {
      skill.rate += increment;
    }
  }
}

/**
 * Oracle Function, takes a skill and decides success or failure.
 */
const oracle = (skill) => {
  if (Math.random() < skill.rate) {
    adjustSkillRate(skill, true);
    return `[You succeed in a ${getAdjective(skill.success)} way.]`;
  } else {
    adjustSkillRate(skill);
    return `[But you utterly fail in a ${getAdjective(skill.failure)} way!]`;
  }
}

/**
 * Command matcher returns the result of a command or a blank string.
 */
const matcher = (text) => {
  const match = text.match(/(> You (try|attempt) to use your (.*) skill)/);
  if (match) {
    const skill = getSkillByName(match[3]);
    state.player.skills.forEach((skill) => {
      if (!(skill.name === match[3].name)) {
        adjustSkillRate(skill, false, true);
      }
    });
    return oracle(skill);
  }
  return ""; // Return empty string if no skill match found.
}

// Every script needs a modifier function
const modifier = (text) => {
  // Call and modify the front Memory so the information is only exposed to the AI for a single turn.
  state.memory.frontMemory = matcher(text)

  return { text }
}

// Don't modify this part
modifier(text)