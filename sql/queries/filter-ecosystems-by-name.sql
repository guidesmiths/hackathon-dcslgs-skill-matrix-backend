SELECT id, name FROM skills.skill_ecosystem as se where lower(se.name) like ( '%' || lower($1) || '%')
ORDER BY name;