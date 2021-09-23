SELECT sc.id as "skillId", "name", "type", "ecosystem", "role_id" as "roleId", "description"
FROM skills.skill_catalog sc
LEFT JOIN skills.skill_role_catalog src ON src.skill_id = sc.id
WHERE sc.id=%L:id;