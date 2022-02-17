/**
 * An answer request type
 * @typedef {object} AnswerRequest
 * @property {number} skill_id - The skill id
 * @property {number} skill_value - The skill value
 * @property {boolean} interested - If the user is interested to learn this
 * @property {string} comments - The user comments related the skill value
 * @property {string} skill_subvalue - The optional skill subvalue - enum: minus, neutral, plus
 * @property {string} user_id - The user id
 */

/**
 * An answer response type
 * @typedef {object} AnswersResponse
 * @property {string} id - The user id
 * @property {string} email - The user email
 * @property {string} name - The user name
 * @property {string} userRole - The user role
 * @property {string} country - The country where the user is based
 * @property {string} seniority - The user seniority
 * @property {array<AnswerEcosystem>} ecosystems - The user skills by ecosystem
 */

/**
 * An answer ecosystem type
 * @typedef {object} AnswerEcosystem
 * @property {number} id - The ecosystem id
 * @property {string} name - The ecosystem name
 * @property {number} average - The user's ecosystem average
 * @property {array<AnswerSkill>} skills - The skills by ecosystem
 */

/**
 * An answer skill type
 * @typedef {object} AnswerSkill
 * @property {number} id - The skill id
 * @property {string} name - The skill name
 * @property {number} level - The skill level
 * @property {number} sublevel - The skill sublevel
 * @property {number} interested - The user's interest about the skill
 * @property {number} comments - The user's comment about the skill
 */

/**
 * Filter parameters: name, skill & level
 * @typedef {object} FilterAnswers
 * @property {string} name - The skill name
 * @property {array<SkillAndLevel>} skills - The user's comment about the skill
*/

/**
 * Filter parameters: Skill&Level
 * @typedef {object} SkillAndLevel
 * @property {string} skill.required - The skill id
 * @property {string} level.required - The level value
*/
