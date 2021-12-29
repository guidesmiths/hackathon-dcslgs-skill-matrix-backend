select se.id from skills.skill_ecosystem se
left join skills.skill_catalog sc on sc.ecosystem = se.id
where sc.id = $1