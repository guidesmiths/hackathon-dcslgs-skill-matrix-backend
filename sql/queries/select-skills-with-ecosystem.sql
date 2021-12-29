SELECT sc.id as "skillId", sc."name" as "skillName", se.name as "ecosystemName"
FROM skills."skill_catalog" sc
left join skills.skill_ecosystem se on se.id = sc.ecosystem;