select se.id as "ecosystemId", se."name" as "ecosystemName", COUNT(se.id)::int as "filledSkillsCount"
from skills.skill_catalog sc
left join skills.skill_ecosystem se on se.id = sc.ecosystem
left join skills.user_skill us on us.skill_id = sc.id and us.user_id = $1
left join skills."user" u on u.user_id = us.user_id
where us.skill_value > 0
group by se.id, u."name"
order by se."name"