const initHandyPg = require('handy-postgres');

const extendHandyPg = require('./extendPostgres');

module.exports = ({ configPath }) => {
  let handyPg;

  const start = async ({ config, logger }) => {
    if ((process.env.NODE_ENV === 'test' || process.env.SERVICE_ENV === 'test') && config.connection.host.includes('azure')) {
      throw new Error('Do not run tests with dev credentials');
    }
    handyPg = initHandyPg({ logger, configPath });
    const pgAPI = await handyPg.start(config);
    const extendedPgAPI = extendHandyPg(pgAPI);

    handyPg = initHandyPg({ logger, configPath });
    return {
      ...extendedPgAPI,
      schema: config.schema,

      fetchUsersFiltered: async (filters, query) => {
        const usersPerPage = 10;
        const { page, name = '' } = query;
        const queryArgs = filters.skills?.map(({ skill, level }) => {
          if (skill && level) {
            return ([skill, level]);
          }
          return null;
        }).flat().filter(Boolean) || [];
        const amountOfFilters = Math.floor(queryArgs.length / 2);
        const skillFilters = amountOfFilters && [...Array(amountOfFilters)].map((value, index) => {
          if (index === 0) {
            return `where (us.skill_id = $${index * 2 + 3} and us.skill_value >= $${index * 2 + 4})`;
          }
          return ` or (us.skill_id = $${index * 2 + 3} and us.skill_value >= $${index * 2 + 4})`;
        });
        const filterName = `%${name}%`;

        const { rows: [{ count: total }] } = await pgAPI.query(`
          select count(*) from (
            select u."name", u.user_id as "id", u.email, u."role", u.country, u.seniority, row_number() over(partition by u.user_id) as rn
              from skills.user_skill us 
              left join skills."user" u on us.user_id = u.user_id 
              ${amountOfFilters > 0 ? skillFilters.join('') : ''}
            order by us.skill_value desc
          ) as data
          where data.rn = $2
          and lower(data."name") like lower($1);
        `, [filterName, amountOfFilters || 1, ...queryArgs]);

        const { rows: users } = await pgAPI.query(`
          select data.name, data.id, data.email, data.role, data.country, data.seniority from (
            select u."name", u.user_id as "id", u.email, u."role", u.country, u.seniority, row_number() over(partition by u.user_id) as rn
              from skills.user_skill us 
              left join skills."user" u on us.user_id = u.user_id 
              ${amountOfFilters > 0 ? skillFilters.join('') : ''}
            order by us.skill_value desc
          ) as data
          where data.rn = $2
          and lower(data."name") like lower($1)
          limit ${usersPerPage} offset ${(page - 1) * usersPerPage};
        `, [filterName, amountOfFilters || 1, ...queryArgs]);

        return { total, users };
      },

    };
  };

  const stop = () => handyPg.stop();

  return { start, stop };
};
