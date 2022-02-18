select u."name" as "userName", u.user_id as "userId", u.email, u.role as "userRole", seniority, country,
sc.id as "skillId", sc."name" as "skillName", us.skill_value as "skillValue", us.skill_subvalue as "skillSubvalue", us.interested, us.comments,
se.id as "ecosystemId", se."name" as "ecosystemName"
from skills.skill_catalog sc
left join skills.skill_ecosystem se on se.id = sc.ecosystem
left join skills.user_skill us on us.skill_id = sc.id and us.user_id = $1
left join skills."user" u on u.user_id = us.user_id
where se.id = $2;