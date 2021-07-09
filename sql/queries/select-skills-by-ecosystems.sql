select se.id as "ecosystemId", se."name" as "ecosystemName",
sc.id as "skillId", sc."name" as "skillName",
sr.id as "roleId", sr."name" as "roleName",
st.id as "typeId", st."name" as "typeName",
scl."level", scl.description
from skills.skill_catalog sc
left join skills.skill_ecosystem se on se.id = sc.ecosystem
left join skills.skill_role sr on sr.id = sc."role"
left join skills.skill_type st on st.id = sc."type"
left join skills.skill_catalog_level scl on scl.skill_id = sc.id
group by sc.id, se."name", sr."name", st."name", scl.description, scl."level", se.id, sr.id, st.id
order by scl."level" asc