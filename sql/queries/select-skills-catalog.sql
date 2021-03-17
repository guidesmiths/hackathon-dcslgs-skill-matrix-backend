select sc.id, sc."name", sc.description, sc.levels, se."name" as ecosystem, sr."name" as "role", st."name" as "type"
from skills.skill_catalog sc
left join skills.skill_ecosystem se on se.id = sc.ecosystem
left join skills.skill_role sr on sr.id = sc."role"
left join skills.skill_type st on st.id = sc."type";