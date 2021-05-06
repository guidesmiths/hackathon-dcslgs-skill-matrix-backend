select u."name", u.user_id, u.email,
coalesce(json_agg(
  json_build_object(
    'id', us.skill_id,
    'skillName', sc."name",
    'level', us.skill_value
  )
), '[]') AS skills
from skills.user_skill us
left join skills.skill_catalog sc on sc.id = us.skill_id
left join skills."user" u on u.user_id = us.user_id
where us.user_id = $1
group by u.user_id;
