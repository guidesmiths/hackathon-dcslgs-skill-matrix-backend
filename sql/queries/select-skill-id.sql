SELECT sc.id FROM skills.skill_catalog sc left join skills.skill_ecosystem se ON se.id = sc.ecosystem
    WHERE sc."name" like ('%' || %L:skill_name) and sc.ecosystem in (SELECT id FROM skills.skill_ecosystem
    where "name" = %L:ecosystem_name ) LIMIT 1