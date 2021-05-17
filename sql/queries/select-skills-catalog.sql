select sc.id, sc."name", se."name" as ecosystem, sr."name" as "role", st."name" as "type", coalesce(json_agg(
  json_build_object(
    'description', scl.description,
    'level', scl."level"
  )
), '[]') AS levels
from skills.skill_catalog sc
left join skills.skill_ecosystem se on se.id = sc.ecosystem
left join skills.skill_role sr on sr.id = sc."role"
left join skills.skill_type st on st.id = sc."type"
left join skills.skill_catalog_level scl on scl.skill_id = sc.id
group by sc.id, se."name", sr."name", st."name";
