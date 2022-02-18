select
  u."name" as "userName",
  u.user_id as "userId",
  u.email,
  u."role" as "userRole",
  u.country,
  u.seniority,
  us.skill_id as "skillId",
  sc."name" as "skillName",
  us.skill_value as "skillValue",
  us.skill_subvalue as "skillSubvalue",
  us.interested,
  us.comments,
  se.id as "ecosystemId",
  se."name" as "ecosystemName",
  scl.description as "levelDescription"
from
  skills."user" u
  left join skills.user_skill us on us.user_id = u.user_id
  left join skills.skill_catalog sc on sc.id = us.skill_id
  left join skills.skill_ecosystem se on se.id = sc.ecosystem
  left join skills.skill_catalog_level scl on scl.skill_id = sc.id
where
  u.user_id = $1
  and us.skill_value = scl.level;