SELECT us.id, u."name" as "user_name", sc."name" as "skill_name", sc.levels as "skill_levels", sc."name" as "skill_ecosystem", sr."name" as "skill_role", us.skill_value, us.created_on, us.updated_on
FROM skills.user_skill us
left join skills."user" u on u.user_id = us.user_id
left join skills.skill_catalog sc on sc.id = us.skill_id
left join skills.skill_ecosystem se on se.id = sc.ecosystem
left join skills.skill_role sr on sr.id = sc.role;