select
	sc."id" as "skillId",
  sc."name" as "skillName"
from skills.user u
left join skills.user_skill us on us.user_id = u.user_id
left join skills.skill_catalog sc on sc.id = us.skill_id
where
	u.user_id = $1
	and us.skill_value > 0
order by sc."name"