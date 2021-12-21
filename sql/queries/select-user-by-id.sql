SELECT "name", user_id as "id", email, "role", country, seniority
FROM skills.user where user_id = %L:id;