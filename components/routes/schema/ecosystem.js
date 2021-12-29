/**
 * A ecosystem type response
 * @typedef {object} EcosystemSimpleResponse
 * @property {number} id - The ecosystem id
 * @property {string} name - The ecosystem name
 * @property {string} created_on - The ecosystem created on date
 * @property {string} updated_on - The ecosystem updated on date
* */

/**
 * A ecosystem type response
 * @typedef {object} EcosystemRequest
 * @property {string} name - The ecosystem name
 * @property {array<EcosystemSkillResponse>} skills - The ecosystem's skills
* */

/**
 * A ecosystem type request
 * @typedef {object} EcosystemResponse
 * @property {number} id - The ecosystem id
 * @property {string} name - The ecosystem name
 // * @property {array<EcosystemSkillResponse>} skills - The ecosystem's skills
* */

/**
 * A skill type request
 * @typedef {object} EcosystemSkillResponse
 * @property {number} id - The skill id
 * @property {string} name - The skill name
 * @property {Type} type - The skill type - "type":{"id":2,"name":"Hard"}
 * @property {array<Role>} roles - The skill roles - "roles":[{"id":1,"name":"Frontend"}]
 * @property {string} description - The skill description
 * @property {array<EcosystemLevel>} levels - The skill levels
* */

/**
 * A level type request
 * @typedef {object} EcosystemLevel
 * @property {string} level - The level name
 * @property {string} levelDescription - The level description
* */
